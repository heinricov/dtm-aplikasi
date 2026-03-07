import { Module } from '@nestjs/common';
import { ReceiptDoService } from './receipt-do.service';
import { ReceiptDoController } from './receipt-do.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ReceiptDoController],
  providers: [ReceiptDoService, PrismaService],
})
export class ReceiptDoModule {}
