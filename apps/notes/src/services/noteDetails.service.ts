import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeCount } from 'packages/common/constant';
import {
  CNoteDetailsDto,
  ParamsDto,
  QueryDto,
  UNoteDetailsDto,
} from 'src/common/DTO/noteDetails.dto';
import { UsersGRPC } from 'src/common/grpc/users/users.grpc';
import {
  NoteDetails,
  ResNotesDetails,
} from 'src/common/interface/noteDetails.interface';
import { NotesDetailsRepository } from 'src/repository/noteDetails.repository';

@Injectable()
export class NoteDetailsService {
  constructor(
    private readonly notesDetailsRepository: NotesDetailsRepository,
    private readonly usersGRPC: UsersGRPC,
  ) {}

  async getAll(query: QueryDto): Promise<ResNotesDetails> {
    return this.notesDetailsRepository.getAll(query);
  }

  async findById(params: ParamsDto): Promise<NoteDetails> {
    return this.notesDetailsRepository.findById(params);
  }

  async created(
    payload: CNoteDetailsDto,
    userId: number,
  ): Promise<NoteDetails> {
    const detail = this.notesDetailsRepository.create(payload);
    await this.usersGRPC.CountNoteDetails(userId, TypeCount.IN_CREASE);
    return detail;
  }

  async updated(payload: UNoteDetailsDto): Promise<NoteDetails> {
    return this.notesDetailsRepository.update(payload);
  }

  async deleted(params: ParamsDto, userId: number): Promise<{ id: number }> {
    const note = await this.findById(params);
    if (!note) {
      throw new NotFoundException();
    }
    const { id } = params;
    await this.notesDetailsRepository.delete(id);
    await this.usersGRPC.CountNoteDetails(userId, TypeCount.DE_CREASE);
    return { id };
  }
}
