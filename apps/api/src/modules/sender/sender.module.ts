import { Module } from '@nestjs/common';
import { SenderService } from './sender.service';
import { SenderController } from './sender.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SenderController],
  providers: [SenderService, PrismaService],
})
export class SenderModule {}
