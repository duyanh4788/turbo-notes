import { Injectable, NotFoundException } from '@nestjs/common';
import { Banners, User } from '@prisma/client';
import { TypeCount } from 'packages/common/constant';
import { Observable } from 'rxjs';
import {
  CountNoteDto,
  CreateUserDto,
  DecreaseTotalDto,
} from 'src/DTO/users.dto';
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
    await this.userRepository.updateCount(
      Number(payload.userId),
      TypeCount.NOTE_COUNT,
    );
    return;
  }

  async CountNoteDetails(payload: CountNoteDto): Promise<Observable<void>> {
    await this.userRepository.updateCount(
      Number(payload.userId),
      TypeCount.NOTE_DETAIL_COUNT,
    );
    return;
  }

  async DecreaseTotal(payload: DecreaseTotalDto): Promise<Observable<void>> {
    const { userId, totalNotes, totalNoteDetails } = payload;
    if (
      !totalNotes ||
      !totalNoteDetails ||
      (!Number(totalNotes) && Number(totalNoteDetails))
    )
      return;
    await this.userRepository.updateCount(
      Number(userId),
      TypeCount.TOTAL_COUNT,
    );
    return;
  }

  async getBanners(): Promise<Banners[]> {
    return await this.userRepository.getBanners();
  }
}
