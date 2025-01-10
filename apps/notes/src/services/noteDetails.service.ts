import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CNoteDetailsDto,
  ParamsDto,
  QueryDto,
  UNoteDetailsDto,
} from 'src/common/DTO/noteDetails.dto';
import {
  NoteDetails,
  ResNotesDetails,
} from 'src/common/interface/noteDetails.interface';
import { NotesDetailsRepository } from 'src/repository/noteDetails.repository';

@Injectable()
export class NoteDetailsService {
  constructor(
    private readonly notesDetailsRepository: NotesDetailsRepository,
  ) {}

  async getAll(query: QueryDto): Promise<ResNotesDetails> {
    return this.notesDetailsRepository.getAll(query);
  }

  async findById(params: ParamsDto): Promise<NoteDetails> {
    return this.notesDetailsRepository.findById(params);
  }

  async created(payload: CNoteDetailsDto): Promise<NoteDetails> {
    return this.notesDetailsRepository.create(payload);
  }

  async updated(payload: UNoteDetailsDto): Promise<NoteDetails> {
    return this.notesDetailsRepository.update(payload);
  }

  async deleted(params: ParamsDto): Promise<{ id: number }> {
    const note = await this.findById(params);
    if (!note) {
      throw new NotFoundException();
    }
    const { id } = params;
    await this.notesDetailsRepository.delete(id);
    return { id };
  }
}
