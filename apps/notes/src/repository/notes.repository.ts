import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'packages/share/services/prisma.service';
import { CNotesDto, UNotesDto } from '../DTO/notes.dto';
import { PagingDto } from '../DTO/paging.dto';
import { CountRes, Notes, ResNotes } from 'packages/interface/notes.interface';
import { RedisService } from 'packages/share/services/redis.service';
import { KeyHasRedis, KeyRedis } from 'packages/common/constant';

@Injectable()
export class NotesRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redis: RedisService,
  ) {}

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
        children: {
          include: { _count: true },
          orderBy: {
            sorting: 'asc',
          },
        },
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
        children: {
          include: { _count: true },
          orderBy: {
            sorting: 'asc',
          },
        },
        _count: true,
      },
    });

    return { total: notes.length, notes };
  }

  async findById(userId: number, id: string): Promise<Notes | null> {
    return this.prismaService.notes.findUnique({
      where: { id, userId },
      include: {
        children: { include: { _count: true }, orderBy: { sorting: 'asc' } },
        _count: true,
      },
    });
  }

  async create(userId: number, payload: CNotesDto): Promise<Notes> {
    const { parentId } = payload;

    const maxSorting = await this.prismaService.notes.aggregate({
      _max: { sorting: true },
      where: { parentId: parentId || undefined },
    });

    const newSorting = (maxSorting._max.sorting || 0) + 1;
    const newNote = await this.prismaService.notes.create({
      data: {
        ...payload,
        userId,
        sorting: newSorting,
      },
    });
    await this.redis._inDecHash(
      `${KeyRedis.USER}_${userId}`,
      KeyHasRedis.NOTE_COUNT,
      1,
    );
    return newNote;
  }

  async update(userId: number, payload: UNotesDto): Promise<Notes> {
    const { id, sorting, parentId } = payload;
    if (sorting && sorting > 0) {
      const note = await this.prismaService.notes.findUnique({
        where: { id },
        select: { sorting: true, parentId: true },
      });
      if (!note) throw new NotFoundException();
      if (note.sorting === sorting && note.parentId === parentId) return;
      await this.updateSortings(note.sorting, sorting, parentId);
    }
    return this.prismaService.notes.update({
      where: { id, userId },
      data: payload,
    });
  }

  async updateSortings(oldSorting: number, sorting: number, parentId: string) {
    await this.prismaService.$transaction([
      this.prismaService.notes.updateMany({
        where: {
          parentId,
          sorting: {
            gte: Math.min(oldSorting, sorting),
            lte: Math.max(oldSorting, sorting),
          },
        },
        data: {
          sorting: oldSorting < sorting ? { decrement: 1 } : { increment: 1 },
        },
      }),
    ]);
  }

  async delete(userId: number, noteId: string): Promise<CountRes> {
    const result = await this.prismaService.$queryRaw<
      {
        deletedNotes: bigint;
        deletedNoteDetails: bigint;
        titleDeletedNoteDetails: string[];
      }[]
    >`
      WITH RECURSIVE NoteTree AS (
        SELECT id FROM notes WHERE id = ${noteId}::uuid AND "userId" = ${userId}
        UNION ALL
        SELECT n.id FROM notes n 
        INNER JOIN NoteTree nt ON n.parent_id = nt.id
        WHERE n."userId" = ${userId}
      ),
      deletedNoteDetails AS (
        DELETE FROM note_details 
        WHERE note_id IN (SELECT id FROM NoteTree)
        RETURNING title, type
      ),
      deletedNotes AS (
        DELETE FROM notes 
        WHERE id IN (SELECT id FROM NoteTree)
        RETURNING 1
      )
      SELECT 
        (SELECT COUNT(*) FROM deletedNotes) AS "deletedNotes",
        (SELECT COUNT(*) FROM deletedNoteDetails) AS "deletedNoteDetails",
        COALESCE((SELECT ARRAY_AGG(dnd.title) FROM deletedNoteDetails dnd WHERE dnd.type = 'uploadFile'), '{}') AS "titleDeletedNoteDetails";
    `;

    const totalNotes = Number(result[0]?.deletedNotes) || 0;
    const totalNoteDetails = Number(result[0]?.deletedNoteDetails) || 0;
    const titleNoteDetails = result[0]?.titleDeletedNoteDetails || [];
    await this.redis._inDecHash(
      `${KeyRedis.USER}_${userId}`,
      KeyHasRedis.NOTE_COUNT,
      -totalNotes,
    );
    await this.redis._inDecHash(
      `${KeyRedis.USER}_${userId}`,
      KeyHasRedis.NOTE_DETAIL_COUNT,
      -totalNoteDetails,
    );
    return { totalNotes, totalNoteDetails, userId, titleNoteDetails };
  }

  async countByUserId(userId: number, noteId: string): Promise<CountRes> {
    const result = await this.prismaService.$queryRaw`
      WITH RECURSIVE NoteTree AS (
      SELECT id FROM notes WHERE id = ${noteId}::uuid and "userId" = ${userId}
      UNION ALL
      SELECT n.id FROM notes n INNER JOIN NoteTree nt ON n.parent_id = nt.id
      )
      SELECT 
        COUNT(*) AS total_notes, 
        (SELECT COUNT(*) FROM note_details WHERE note_id IN (SELECT id FROM NoteTree)) AS total_note_details
      FROM NoteTree;
    `;

    const totalNotes = Number(result[0]?.total_notes) || 0;
    const totalNoteDetails = Number(result[0]?.total_note_details) || 0;

    return { totalNotes, totalNoteDetails, noteId };
  }
}
