import { Injectable, NotFoundException } from '@nestjs/common';
import { NoteDetailType, User } from '@prisma/client';
import { IndexSearch, TypeCount } from 'packages/common/constant';
import { ElasticsearchService } from 'packages/share/services/elastichsearch.service';
import {
  CNoteDetailsDto,
  ParamsDto,
  QueryDto,
  UNoteDetailsDto,
} from 'src/common/DTO/noteDetails.dto';
import { NotificationsGRPC } from 'src/common/grpc/notifications/notifications.grpc';
import { SendNotiReq } from 'src/common/grpc/notifications/options';
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
    private readonly notificationsGRPC: NotificationsGRPC,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async searchs(userId: number, text: string): Promise<ResNotesDetails> {
    const hits = await this.elasticsearchService.search(
      IndexSearch.NOTE_DETAILS,
      text,
    );
    if (!hits || !hits.length) return { total: 0, noteDetails: [] };
    const ids = hits.map((x) => Number(x._id));
    return this.notesDetailsRepository.getByIds(userId, ids);
  }

  async getAll(userId: number, query: QueryDto): Promise<ResNotesDetails> {
    return this.notesDetailsRepository.getAll(userId, query);
  }

  async findById(userId: number, params: ParamsDto): Promise<NoteDetails> {
    return this.notesDetailsRepository.findById(userId, params);
  }

  async created(user: User, payload: CNoteDetailsDto): Promise<NoteDetails> {
    const detail = await this.notesDetailsRepository.create(payload, user.id);
    await this.usersGRPC.CountNoteDetails(user.id, TypeCount.IN_CREASE);
    if (detail.type === NoteDetailType.schedule && detail.scheduleTime) {
      await this.notificationsGRPC.SendNotification(
        this.initPayloadSendNoti(detail, user),
      );
    }
    await this.elasticsearchService.indexData(
      IndexSearch.NOTE_DETAILS,
      detail.id.toString(),
      detail,
    );
    return detail;
  }

  async updated(user: User, payload: UNoteDetailsDto): Promise<NoteDetails> {
    const noteDetail = await this.findById(user.id, {
      id: payload.id,
      noteId: payload.noteId,
    });
    const newDetail = await this.notesDetailsRepository.update(
      user.id,
      payload,
    );
    if (newDetail.type === NoteDetailType.schedule) {
      if (
        noteDetail.scheduleTime.getTime() !== newDetail.scheduleTime.getTime()
      ) {
        await this.notificationsGRPC.SendNotification(
          this.initPayloadSendNoti(newDetail, user),
        );
      }
    }
    await this.elasticsearchService.indexData(
      IndexSearch.NOTE_DETAILS,
      newDetail.id.toString(),
      newDetail,
    );
    return newDetail;
  }

  async deleted(userId: number, params: ParamsDto): Promise<{ id: number }> {
    const noteDetail = await this.findById(userId, params);
    if (!noteDetail) {
      throw new NotFoundException();
    }
    const { id } = params;
    await this.notesDetailsRepository.delete(userId, id);
    await this.usersGRPC.CountNoteDetails(userId, TypeCount.DE_CREASE);
    await this.elasticsearchService.deleteData(
      IndexSearch.NOTE_DETAILS,
      id.toString(),
    );
    return { id };
  }

  private initPayloadSendNoti(data: NoteDetails, user: User): SendNotiReq {
    return {
      noteDetailId: data.id,
      scheduleTime: data.scheduleTime.toISOString(),
      title: data.title,
      content: data.content,
      email: user.email,
      userName: user.userName,
    };
  }
}
