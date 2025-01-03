import {
  NoteDetails as NoteDetailsPrisma,
  Notes as NotesPrisma,
} from '@prisma/client';

export interface ResNotes {
  notes: Notes[];
  total: number;
}

export type Notes = {
  noteDetails?: NoteDetails[];
} & NotesPrisma;

export type NoteDetails = NoteDetailsPrisma;
