import { Module } from '@nestjs/common';
import { ReceiptPlService } from './receipt-pl.service';
import { ReceiptPlController } from './receipt-pl.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ReceiptPlController],
  providers: [ReceiptPlService, PrismaService],
})
export class ReceiptPlModule {}
