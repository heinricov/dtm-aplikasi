import { Module } from '@nestjs/common';
import { ReceiptInvoiceService } from './receipt-invoice.service';
import { ReceiptInvoiceController } from './receipt-invoice.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ReceiptInvoiceController],
  providers: [ReceiptInvoiceService, PrismaService],
})
export class ReceiptInvoiceModule {}
