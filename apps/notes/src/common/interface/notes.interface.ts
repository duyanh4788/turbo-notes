import { Notes as NotesPrisma } from '@prisma/client';
import { NoteDetails } from './noteDetails.interface';

export type Notes = {
  noteDetails?: NoteDetails[];
} & NotesPrisma;
export interface ResNotes {
  notes: Notes[];
  total: number;
}
