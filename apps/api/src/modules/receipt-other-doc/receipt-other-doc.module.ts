import { Module } from '@nestjs/common';
import { ReceiptOtherDocService } from './receipt-other-doc.service';
import { ReceiptOtherDocController } from './receipt-other-doc.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ReceiptOtherDocController],
  providers: [ReceiptOtherDocService, PrismaService],
})
export class ReceiptOtherDocModule {}
