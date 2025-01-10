import { Injectable, NotFoundException } from '@nestjs/common';
import { ChildNotesDto, CNotesDto, UNotesDto } from 'src/common/DTO/notes.dto';
import { PagingDto } from 'src/common/DTO/paging.dto';
import { Notes, ResNotes } from 'src/common/interface/notes.interface';
import { NotesRepository } from 'src/repository/notes.repository';

@Injectable()
export class NotesService {
  constructor(private readonly userRepository: NotesRepository) {}

  async getAll(userId: number, query: PagingDto): Promise<ResNotes> {
    return this.userRepository.getAll(userId, query);
  }

  async findById(userId: number, id: string): Promise<Notes> {
    return this.userRepository.findById(userId, id);
  }

  async created(userId: number, payload: CNotesDto): Promise<Notes> {
    return this.userRepository.create(userId, payload);
  }

  async updated(userId: number, payload: UNotesDto): Promise<Notes> {
    return this.userRepository.update(userId, payload);
  }

  async deleted(
    userId: number,
    id: string,
  ): Promise<{ id: string; parentId: string }> {
    const note = await this.findById(userId, id);
    if (!note) {
      throw new NotFoundException();
    }
    await this.userRepository.delete(userId, note.id);
    return { id, parentId: note.parentId };
  }

  async createdChild(userId: number, payload: ChildNotesDto): Promise<Notes> {
    const note = await this.findById(userId, payload.parentId);
    if (!note) {
      throw new NotFoundException();
    }
    return this.userRepository.create(userId, payload);
  }
}
