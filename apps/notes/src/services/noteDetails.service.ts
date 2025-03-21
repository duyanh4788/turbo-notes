import { Injectable, NotFoundException } from '@nestjs/common';
import { NoteDetailType, User } from '@prisma/client';
import { FLODER_GCS, TableName, TypeCount } from 'packages/common/constant';
import { ElasticsearchService } from 'packages/share/services/elastichsearch.service';
import { NotesDetailsRepository } from 'src/repository/noteDetails.repository';
import {
  CNoteDetailsDto,
  ParamsDto,
  QueryDto,
  UNoteDetailsDto,
} from '../DTO/noteDetails.dto';
import { UsersGRPC } from '../grpc/users/users.grpc';
import {
  FileGcs,
  NoteDetails,
  ResNotesDetails,
} from 'packages/interface/noteDetails.interface';
import { GCStorageService } from './gcstorage.service';
import { config } from 'packages/config';

@Injectable()
export class NoteDetailsService {
  constructor(
    private readonly notesDetailsRepository: NotesDetailsRepository,
    private readonly usersGRPC: UsersGRPC,
    private readonly gCStorageService: GCStorageService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async searchs(userId: number, text: string): Promise<ResNotesDetails> {
    const hits = await this.elasticsearchService.search(
      TableName.NOTE_DETAILS,
      text,
    );
    if (!hits || !hits.length) return { total: 0, noteDetails: [] };
    const ids = hits.map((x) => Number(x.id));
    return this.notesDetailsRepository.getByIds(userId, ids);
  }

  async getAll(userId: number, query: QueryDto): Promise<ResNotesDetails> {
    return this.notesDetailsRepository.getAll(userId, query);
  }

  async findById(userId: number, params: ParamsDto): Promise<NoteDetails> {
    const noteDetail = await this.notesDetailsRepository.findById(
      userId,
      params,
    );
    if (!noteDetail) {
      throw new NotFoundException();
    }
    return noteDetail;
  }

  async created(user: User, payload: CNoteDetailsDto): Promise<NoteDetails> {
    if (payload.title.length >= 99) {
      payload.title = payload.title.slice(0, 99);
    }
    const detail = await this.notesDetailsRepository.create(payload, user.id);
    await this.usersGRPC.CountNoteDetails(user.id, TypeCount.IN_CREASE);
    return detail;
  }

  async uploadFile(
    userId: number,
    noteId: string,
    file: FileGcs,
  ): Promise<NoteDetails> {
    if (!file) {
      throw new NotFoundException();
    }
    const uploadFile = await this.gCStorageService.uploadFile(file);
    if (!uploadFile || !uploadFile.publicUrl) {
      throw new NotFoundException();
    }
    const payload = new CNoteDetailsDto();
    payload.title = uploadFile.name.split('/')[1];
    payload.content = uploadFile.name.split('/')[1];
    payload.noteId = noteId;
    payload.type = NoteDetailType.uploadFile;
    const detail = await this.notesDetailsRepository.create(payload, userId);
    await this.usersGRPC.CountNoteDetails(userId, TypeCount.IN_CREASE);
    return detail;
  }

  async updated(user: User, payload: UNoteDetailsDto): Promise<NoteDetails> {
    await this.findById(user.id, {
      id: payload.id,
      noteId: payload.noteId,
    });
    if (payload.title.length >= 99) {
      payload.title = payload.title.slice(0, 99);
    }
    const newDetail = await this.notesDetailsRepository.update(
      user.id,
      payload,
    );
    return newDetail;
  }

  async deleted(userId: number, params: ParamsDto): Promise<{ id: number }> {
    const noteDetail = await this.findById(userId, params);
    const { id } = params;
    await this.notesDetailsRepository.delete(userId, id);
    if (noteDetail.type === NoteDetailType.uploadFile) {
      await this.gCStorageService.removeFile(noteDetail.title);
    }
    await this.usersGRPC.CountNoteDetails(userId, TypeCount.DE_CREASE);
    return { id };
  }

  async getFile(userId: number, params: ParamsDto): Promise<string> {
    const noteDetail = await this.findById(userId, params);
    return `https://storage.googleapis.com/${config.GCS.BUCKET}/${FLODER_GCS}/${noteDetail.content}`;
  }
}
