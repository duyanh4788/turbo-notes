import { NoteDetails as NoteDetailsPrisma } from '@prisma/client';

export type NoteDetails = NoteDetailsPrisma;

export interface ResNotesDetails {
  noteDetails: NoteDetails[];
  noteId?: string;
  total: number;
}

export interface FileGcs {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export const FLODER_GCS = 'mms_content_media';
