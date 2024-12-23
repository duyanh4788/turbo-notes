import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'packages/share/services/prisma.service';
import { CreateUserDto } from 'src/common/DTO/users.dto';

@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: CreateUserDto): Promise<User> {
        return await this.prismaService.user.create({
            data,
        });
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
        return await this.prismaService.user.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<User> {
        return await this.prismaService.user.delete({
            where: { id },
        });
    }

    async getAll(): Promise<User[]> {
        return await this.prismaService.user.findMany();
    }
}