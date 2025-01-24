import { Injectable, NotFoundException } from '@nestjs/common';
import { NoteDetailType, User } from '@prisma/client';
import { TypeCount } from 'packages/common/constant';
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
  ) {}

  async getAll(query: QueryDto): Promise<ResNotesDetails> {
    return this.notesDetailsRepository.getAll(query);
  }

  async findById(params: ParamsDto): Promise<NoteDetails> {
    return this.notesDetailsRepository.findById(params);
  }

  async created(payload: CNoteDetailsDto, user: User): Promise<NoteDetails> {
    const detail = await this.notesDetailsRepository.create(payload);
    await this.usersGRPC.CountNoteDetails(user.id, TypeCount.IN_CREASE);
    if (detail.type === NoteDetailType.schedule && detail.scheduleTime) {
      await this.notificationsGRPC.SendNotification(
        this.initPayloadSendNoti(detail, user),
      );
    }
    return detail;
  }

  async updated(payload: UNoteDetailsDto, user: User): Promise<NoteDetails> {
    const noteDetail = await this.findById({
      id: payload.id,
      noteId: payload.noteId,
    });
    const newDetail = await this.notesDetailsRepository.update(payload);
    if (newDetail.type === NoteDetailType.schedule) {
      if (
        noteDetail.scheduleTime.getTime() !== newDetail.scheduleTime.getTime()
      ) {
        await this.notificationsGRPC.SendNotification(
          this.initPayloadSendNoti(newDetail, user),
        );
      }
    }
    return newDetail;
  }

  async deleted(params: ParamsDto, userId: number): Promise<{ id: number }> {
    const noteDetail = await this.findById(params);
    if (!noteDetail) {
      throw new NotFoundException();
    }
    const { id } = params;
    await this.notesDetailsRepository.delete(id);
    await this.usersGRPC.CountNoteDetails(userId, TypeCount.DE_CREASE);
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
