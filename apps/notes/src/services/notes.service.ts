import { Injectable, NotFoundException } from '@nestjs/common';
import { IndexSearch, TypeCount } from 'packages/common/constant';
import { ChildNotesDto, CNotesDto, UNotesDto } from 'src/common/DTO/notes.dto';
import { PagingDto } from 'src/common/DTO/paging.dto';
import { Notes, ResNotes } from 'src/common/interface/notes.interface';
import { NotesRepository } from 'src/repository/notes.repository';
import { UsersGRPC } from 'src/common/grpc/users/users.grpc';
import { ElasticsearchService } from 'packages/share/services/elastichsearch.service';

@Injectable()
export class NotesService {
  constructor(
    private readonly notesRepository: NotesRepository,
    private readonly usersGRPC: UsersGRPC,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async searchs(userId: number, text: string): Promise<ResNotes> {
    const hits = await this.elasticsearchService.search(
      IndexSearch.NOTES,
      text,
    );
    if (!hits || !hits.length) return { total: 0, notes: [] };
    const noteIds = hits.map((x) => x._id);
    return this.notesRepository.getByIds(userId, noteIds);
  }

  async getAll(userId: number, query: PagingDto): Promise<ResNotes> {
    return this.notesRepository.getAll(userId, query);
  }

  async findById(userId: number, id: string): Promise<Notes> {
    return this.notesRepository.findById(userId, id);
  }

  async created(userId: number, payload: CNotesDto): Promise<Notes> {
    const newNote = await this.notesRepository.create(userId, payload);
    await this.elasticsearchService.indexData(
      IndexSearch.NOTES,
      newNote.id,
      newNote,
    );
    await this.usersGRPC.CountNotes(userId, TypeCount.IN_CREASE);
    return newNote;
  }

  async updated(userId: number, payload: UNotesDto): Promise<Notes> {
    await this.elasticsearchService.indexData(
      IndexSearch.NOTES,
      payload.id,
      payload,
    );
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
    await this.notesRepository.delete(userId, note.id);
    await this.elasticsearchService.deleteData(IndexSearch.NOTES, id);
    await this.usersGRPC.CountNotes(userId, TypeCount.DE_CREASE);
    return { id, parentId: note.parentId };
  }

  async createdChild(userId: number, payload: ChildNotesDto): Promise<Notes> {
    const note = await this.findById(userId, payload.parentId);
    if (!note) {
      throw new NotFoundException();
    }
    const newNote = await this.notesRepository.create(userId, payload);
    await this.elasticsearchService.indexData(
      IndexSearch.NOTES,
      newNote.id,
      newNote,
    );
    await this.usersGRPC.CountNotes(userId, TypeCount.IN_CREASE);
    return newNote;
  }
}
