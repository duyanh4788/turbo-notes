import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/common/DTO/users.dto';
import { UserRepository } from 'src/repository/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) { }

  async created(data: CreateUserDto): Promise<User> {
    if (data.email) {
      const user = await this.userRepository.findByEmail(data.email);
      if (user) return user;
    }
    await this.userRepository.create(data)
  }
}
