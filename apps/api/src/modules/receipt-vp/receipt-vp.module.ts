import { Module } from '@nestjs/common';
import { ReceiptVpService } from './receipt-vp.service';
import { ReceiptVpController } from './receipt-vp.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ReceiptVpController],
  providers: [ReceiptVpService, PrismaService],
})
export class ReceiptVpModule {}
