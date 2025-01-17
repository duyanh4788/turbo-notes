import { NoteDetails as NoteDetailsPrisma } from '@prisma/client';

export type NoteDetails = NoteDetailsPrisma;

export interface ResNotesDetails {
  noteDetails: NoteDetails[];
  noteId: string;
  total: number;
}
