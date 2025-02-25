import { Injectable, NotFoundException } from '@nestjs/common';
import { Banners, User } from '@prisma/client';
import { TypeCount } from 'packages/common/constant';
import { Observable } from 'rxjs';
import { CountNoteDto, CreateUserDto } from 'src/common/DTO/users.dto';
import { UserRepository } from 'src/repository/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async created(data: CreateUserDto): Promise<User> {
    if (data.email) {
      const user = await this.userRepository.findByEmail(data.email);
      if (user && !user.tokenData) {
        return await this.userRepository.updateToken(user);
      }
      if (user) return user;
    }
    return await this.userRepository.create(data);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async SignOut(userId: number): Promise<void> {
    const user = await this.findById(userId);
    user.tokenData = null;
    await this.userRepository.update(userId, user);
    return;
  }

  async CountNotes(payload: CountNoteDto): Promise<Observable<void>> {
    const { userId, typeCount } = payload;
    const userIdNumber = Number(userId);
    const user = await this.findById(userIdNumber);
    user.notesCount =
      typeCount === TypeCount.IN_CREASE
        ? user.notesCount + 1
        : user.notesCount - 1;
    if (user.notesCount < 0) {
      user.notesCount = 0;
    }
    await this.userRepository.update(userIdNumber, user);
    return;
  }

  async CountNoteDetails(payload: CountNoteDto): Promise<Observable<void>> {
    const { userId, typeCount } = payload;
    const userIdNumber = Number(userId);
    const user = await this.findById(userIdNumber);
    user.noteDetailsCount =
      typeCount === TypeCount.IN_CREASE
        ? user.noteDetailsCount + 1
        : user.noteDetailsCount - 1;
    if (user.noteDetailsCount < 0) {
      user.noteDetailsCount = 0;
    }
    await this.userRepository.update(userIdNumber, user);
    return;
  }

  async getBanners(): Promise<Banners[]> {
    return await this.userRepository.getBanners();
  }
}
