import { User } from '@prisma/client';

export {};

declare global {
  namespace Express {
    interface Request {
      user?: User; // 👈️ turn off type checking
    }
  }
}
