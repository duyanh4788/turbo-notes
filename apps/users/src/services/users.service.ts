import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/common/DTO/users.dto';
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
    await this.userRepository.create(data);
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
}
