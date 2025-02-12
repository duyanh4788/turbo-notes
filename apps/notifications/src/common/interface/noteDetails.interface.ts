import { NoteDetails } from '@prisma/client';

export interface NoteDetailsLIstener {
  operation: OperationPSQL;
  table: string;
  new_data?: NoteDetails;
  old_data?: string;
  id?: number;
}

export enum ExchangeRabbit {
  NOTE_DETAILS_EXCHANGE = 'NOTE_DETAILS_EXCHANGE',
  NOTE_DETAILS_QUEUE = 'NOTE_DETAILS_QUEUE',
  SCHEDULE_MAIN_EX = 'SCHEDULE_MAIN_EX',
  SCHEDULE_DELAY_EX = 'SCHEDULE_DELAY_EX',
  SCHEDULE_MAIN_QUEUE = 'SCHEDULE_MAIN_QUEUE',
  SCHEDULE_DELAY_QUEUE = 'SCHEDULE_DELAY_QUEUE',
  SCHEDULE_DELAY = 'SCHEDULE_DELAY',
}

export enum OperationPSQL {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum ValueListener {
  NOTE_DETAIL_CHANNEL = 'note_detail_channel',
}

export enum RedisKey {
  NOTEDETAIL_SCHEDULE = 'NOTEDETAIL_SCHEDULE',
}
