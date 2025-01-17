import { Injectable } from '@nestjs/common';
import { NoteDetails } from '@prisma/client';
import { PrismaService } from 'packages/share/services/prisma.service';
import {
  CNoteDetailsDto,
  ParamsDto,
  QueryDto,
  UNoteDetailsDto,
} from 'src/common/DTO/noteDetails.dto';
import { ResNotesDetails } from 'src/common/interface/noteDetails.interface';

@Injectable()
export class NotesDetailsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(query: QueryDto): Promise<ResNotesDetails> {
    const { skip = 0, limit = 10, noteId } = query;

    const total = await this.prismaService.noteDetails.count({
      where: {
        noteId,
      },
    });

    const noteDetails = await this.prismaService.noteDetails.findMany({
      where: {
        noteId,
      },
      skip: Number(skip),
      take: Number(limit),
      orderBy: {
        sorting: 'asc',
      },
    });

    return { noteDetails, total, noteId };
  }

  async findById(params: ParamsDto): Promise<NoteDetails | null> {
    const { id, noteId } = params;
    return this.prismaService.noteDetails.findUnique({
      where: { id, noteId },
    });
  }

  async create(payload: CNoteDetailsDto): Promise<NoteDetails> {
    return this.prismaService.noteDetails.create({
      data: payload,
    });
  }

  async update(payload: UNoteDetailsDto): Promise<NoteDetails> {
    const { id } = payload;
    return this.prismaService.noteDetails.update({
      where: { id },
      data: payload,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.noteDetails.delete({
      where: { id },
    });
  }
}
