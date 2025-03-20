import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: () => PrismaService.getInstance(),
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
