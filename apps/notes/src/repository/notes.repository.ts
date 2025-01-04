import { Injectable } from '@nestjs/common';
import { PrismaService } from 'packages/share/services/prisma.service';
import {
  CNotesDto,
  ChildNotesDto,
  GANotesDto,
  UNotesDto,
} from 'src/common/DTO/notes.dto';
import { Notes, ResNotes } from 'src/common/interface/notes.interface';

@Injectable()
export class NotesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(userId: number, query: GANotesDto): Promise<ResNotes> {
    const { skip = 0, limit = 10 } = query;

    const total = await this.prismaService.notes.count({
      where: {
        userId,
        parentId: null,
      },
    });

    const notes = await this.prismaService.notes.findMany({
      where: {
        userId,
        parentId: null,
      },
      skip: Number(skip),
      take: Number(limit),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        children: true,
      },
    });

    return { total, notes };
  }

  async findById(userId: number, id: number): Promise<Notes | null> {
    return this.prismaService.notes.findUnique({
      where: { id, userId },
      include: {
        children: true,
      },
    });
  }

  async create(
    userId: number,
    payload: CNotesDto | ChildNotesDto,
  ): Promise<Notes> {
    const newData = { ...payload, userId };
    return this.prismaService.notes.create({
      data: newData,
    });
  }

  async update(userId: number, payload: UNotesDto): Promise<Notes> {
    const { id } = payload;
    return this.prismaService.notes.update({
      where: { id, userId },
      data: payload,
    });
  }

  async delete(userId: number, id: number): Promise<void> {
    await this.prismaService.notes.delete({
      where: { id, userId },
    });
  }
}
