import { Injectable } from '@nestjs/common';
import { NoteDetails } from '@prisma/client';
import { PrismaService } from 'packages/share/services/prisma.service';
import {
  CNoteDetailsDto,
  ParamsDto,
  QueryDto,
  UNoteDetailsDto,
} from '../DTO/noteDetails.dto';
import { ResNotesDetails } from 'packages/interface/noteDetails.interface';
import { RedisService } from 'packages/share/services/redis.service';
import { KeyHasRedis, KeyRedis } from 'packages/common/constant';

@Injectable()
export class NotesDetailsRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getAll(userId: number, query: QueryDto): Promise<ResNotesDetails> {
    const { skip = 0, limit = 10, noteId } = query;

    const total = await this.prismaService.noteDetails.count({
      where: {
        noteId,
        userId,
      },
    });

    const noteDetails = await this.prismaService.noteDetails.findMany({
      where: {
        noteId,
        userId,
      },
      skip: Number(skip),
      take: Number(limit),
      orderBy: {
        sorting: 'desc',
      },
    });

    return { noteDetails, total, noteId };
  }

  async getByIds(userId: number, ids: number[]): Promise<ResNotesDetails> {
    const noteDetails = await this.prismaService.noteDetails.findMany({
      where: {
        userId,
        id: { in: ids },
      },
      orderBy: {
        sorting: 'asc',
      },
    });

    return { total: noteDetails.length, noteDetails };
  }

  async findById(
    userId: number,
    params: ParamsDto,
  ): Promise<NoteDetails | null> {
    const { id, noteId } = params;
    return this.prismaService.noteDetails.findUnique({
      where: { id, noteId, userId },
    });
  }

  async create(payload: CNoteDetailsDto, userId: number): Promise<NoteDetails> {
    const noteDetail = await this.prismaService.noteDetails.create({
      data: { ...payload, userId },
    });
    await this.redis._setString(
      `${KeyRedis.CONTENT_NOTE_DETAIL}_${noteDetail.id}`,
      noteDetail.content,
    );
    await this.redis._inDecHash(
      `${KeyRedis.USER}_${userId}`,
      KeyHasRedis.NOTE_DETAIL_COUNT,
      1,
    );
    return noteDetail;
  }

  async update(userId: number, payload: UNoteDetailsDto): Promise<NoteDetails> {
    const { id } = payload;
    const noteDetail = await this.prismaService.noteDetails.update({
      where: { id, userId },
      data: payload,
    });
    await this.redis._setString(
      `${KeyRedis.CONTENT_NOTE_DETAIL}_${noteDetail.id}`,
      noteDetail.content,
    );
    return noteDetail;
  }

  async delete(userId: number, id: number): Promise<void> {
    await this.prismaService.noteDetails.delete({
      where: { id, userId },
    });
    await this.redis._del(`${KeyRedis.CONTENT_NOTE_DETAIL}_${id}`);
    await this.redis._inDecHash(
      `${KeyRedis.USER}_${userId}`,
      KeyHasRedis.NOTE_DETAIL_COUNT,
      -1,
    );
  }
}
