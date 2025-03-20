import { User } from '@prisma/client';

export interface UserRedis {
  user: User;
  notesCount: number;
  noteDetailsCount: number;
}
