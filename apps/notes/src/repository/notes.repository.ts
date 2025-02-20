import { Injectable } from '@nestjs/common';
import { PrismaService } from 'packages/share/services/prisma.service';
import { CNotesDto, ChildNotesDto, UNotesDto } from '../common/DTO/notes.dto';
import { PagingDto } from '../common/DTO/paging.dto';
import { Notes, ResNotes } from '../common/interface/notes.interface';

@Injectable()
export class NotesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(userId: number, query: PagingDto): Promise<ResNotes> {
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
        sorting: 'asc',
      },
      include: {
        children: { include: { _count: true } },
        _count: true,
      },
    });

    return { total, notes };
  }

  async getByIds(userId: number, ids: string[]): Promise<ResNotes> {
    const notes = await this.prismaService.notes.findMany({
      where: {
        userId,
        id: { in: ids },
      },
      orderBy: {
        sorting: 'asc',
      },
      include: {
        children: { include: { _count: true } },
        _count: true,
      },
    });

    return { total: notes.length, notes };
  }

  async findById(userId: number, id: string): Promise<Notes | null> {
    return this.prismaService.notes.findUnique({
      where: { id, userId },
      include: {
        children: {
          orderBy: {
            sorting: 'asc',
          },
        },
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

  async delete(userId: number, id: string): Promise<void> {
    await this.prismaService.notes.delete({
      where: { id, userId },
    });
  }
}
