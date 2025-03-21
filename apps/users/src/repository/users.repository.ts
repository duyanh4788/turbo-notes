import { Injectable } from '@nestjs/common';
import { Banners, User } from '@prisma/client';
import { KeyHasRedis, KeyRedis, TypeCount } from 'packages/common/constant';
import { PrismaService } from 'packages/share/services/prisma.service';
import { RedisService } from 'packages/share/services/redis.service';
import { Helper } from 'packages/utils/helper';
import { CreateUserDto } from 'src/DTO/users.dto';

@Injectable()
export class UserRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    if (data.tokenGg) {
      data.tokenData = Helper.generateToken(data.email, data.tokenGg);
    }
    const user = await this.prismaService.user.create({
      data,
    });
    await this.setHashRedisUser(user);
    return user;
  }

  async findById(id: number): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.prismaService.user.update({
      where: { id },
      data,
    });
    await this.setHashRedisUser(user);
    return user;
  }

  async updateCount(userId: number, typeUpdate: TypeCount): Promise<void> {
    let notesCount = 0;
    let noteDetailsCount = 0;
    if (
      typeUpdate === TypeCount.NOTE_COUNT ||
      typeUpdate === TypeCount.TOTAL_COUNT
    ) {
      notesCount = await this.redis._getHash(
        `${KeyRedis.USER}_${userId}`,
        KeyHasRedis.NOTE_COUNT,
      );
    }

    if (
      typeUpdate === TypeCount.NOTE_DETAIL_COUNT ||
      typeUpdate === TypeCount.TOTAL_COUNT
    ) {
      noteDetailsCount = await this.redis._getHash(
        `${KeyRedis.USER}_${userId}`,
        KeyHasRedis.NOTE_DETAIL_COUNT,
      );
    }
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        notesCount: Math.max(notesCount, 0),
        noteDetailsCount: Math.max(noteDetailsCount, 0),
      },
    });
    await this.setHashRedisUser(user);
    return;
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.user.delete({
      where: { id },
    });
    await this.redis._del(`${KeyRedis.USER}_${id}`);
  }

  async getAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async updateToken(data: User): Promise<User> {
    data.tokenData = Helper.generateToken(data.email, data.tokenGg);
    const user = await this.prismaService.user.update({
      where: { id: data.id },
      data,
    });
    await this.setHashRedisUser(user);
    return user;
  }

  async getBanners(): Promise<Banners[]> {
    let banners: Banners[] = await this.redis._getString(KeyRedis.BANNER);
    if (banners) return banners;

    banners = await this.prismaService.banners.findMany({
      orderBy: { sorting: 'asc' },
    });
    await this.redis._setString(KeyRedis.BANNER, banners);
    return banners;
  }

  private async setHashRedisUser(user: User) {
    const keyMain = `${KeyRedis.USER}_${user.id}`;
    await this.redis._setHash(keyMain, KeyHasRedis.USER_DATA, user);
  }
}
