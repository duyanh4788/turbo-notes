import { NoteDetails } from '@prisma/client';
import { OperationPSQL } from 'packages/common/constant';

export interface NoteDetailsLIstener {
  operation: OperationPSQL;
  table: string;
  new_data?: NoteDetails;
  old_data?: string;
  id?: number;
}
