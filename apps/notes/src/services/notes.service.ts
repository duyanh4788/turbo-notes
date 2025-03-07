import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeCount } from 'packages/common/constant';
import { NotesRepository } from 'src/repository/notes.repository';
import { CNotesDto, UNotesDto } from '../common/DTO/notes.dto';
import { PagingDto } from '../common/DTO/paging.dto';
import { CountRes, Notes, ResNotes } from '../common/interface/notes.interface';
import { UsersGRPC } from '../grpc/users/users.grpc';
import { GCStorageService } from './gcstorage.service';

@Injectable()
export class NotesService {
  constructor(
    private readonly notesRepository: NotesRepository,
    private readonly usersGRPC: UsersGRPC,
    private readonly gCStorageService: GCStorageService,
  ) {}

  async getAll(userId: number, query: PagingDto): Promise<ResNotes> {
    return this.notesRepository.getAll(userId, query);
  }

  async findById(userId: number, id: string): Promise<Notes> {
    return this.notesRepository.findById(userId, id);
  }

  async created(userId: number, payload: CNotesDto): Promise<Notes> {
    if (payload.label.length >= 99) {
      payload.label = payload.label.slice(0, 99);
    }
    const newNote = await this.notesRepository.create(userId, payload);
    await this.usersGRPC.CountNotes(userId, TypeCount.IN_CREASE);
    return newNote;
  }

  async updated(userId: number, payload: UNotesDto): Promise<Notes> {
    if (payload.label && payload.label.length >= 99) {
      payload.label = payload.label.slice(0, 99);
    }
    return this.notesRepository.update(userId, payload);
  }

  async deleted(
    userId: number,
    id: string,
  ): Promise<{ id: string; parentId: string }> {
    const note = await this.findById(userId, id);
    if (!note) {
      throw new NotFoundException();
    }
    const result = await this.notesRepository.delete(userId, note.id);
    const { titleNoteDetails, ...parseResult } = result;
    await this.usersGRPC.DecreaseTotal(parseResult);
    if (titleNoteDetails && titleNoteDetails.length) {
      await Promise.all(
        titleNoteDetails.map(async (item) => {
          await this.gCStorageService.removeFile(item);
        }),
      );
    }
    return { id, parentId: note.parentId };
  }

  async createdChild(userId: number, payload: CNotesDto): Promise<Notes> {
    const note = await this.findById(userId, payload.parentId);
    if (!note) {
      throw new NotFoundException();
    }
    const newNote = await this.notesRepository.create(userId, payload);
    await this.usersGRPC.CountNotes(userId, TypeCount.IN_CREASE);
    return newNote;
  }

  async countByUserId(userId: number, noteId: string): Promise<CountRes> {
    return this.notesRepository.countByUserId(userId, noteId);
  }
}
