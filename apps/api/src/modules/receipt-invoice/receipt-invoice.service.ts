import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateReceiptInvoiceDto } from './dto/create-receipt-invoice.dto';
import { UpdateReceiptInvoiceDto } from './dto/update-receipt-invoice.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReceiptInvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReceiptInvoiceDto: CreateReceiptInvoiceDto) {
    const scanDate =
      typeof createReceiptInvoiceDto.scan_date === 'string'
        ? new Date(createReceiptInvoiceDto.scan_date)
        : createReceiptInvoiceDto.scan_date;
    const uploadDate =
      typeof createReceiptInvoiceDto.upload_date === 'string'
        ? new Date(createReceiptInvoiceDto.upload_date)
        : createReceiptInvoiceDto.upload_date;
    return await this.prisma.receiptInvoice.create({
      data: {
        incoming_document_id: createReceiptInvoiceDto.incoming_document_id,
        silo_id: createReceiptInvoiceDto.silo_id,
        vendor_id: createReceiptInvoiceDto.vendor_id,
        no_invoice: createReceiptInvoiceDto.no_invoice ?? null,
        no_po: createReceiptInvoiceDto.no_po ?? null,
        scan_date: scanDate ?? null,
        upload_date: uploadDate ?? null,
        description: createReceiptInvoiceDto.description ?? null,
      },
    });
  }

  async findAll() {
    try {
      return await this.prisma.receiptInvoice.findMany({
        include: {
          incoming_document: {
            select: { id: true, title: true, document_receipt_date: true },
          },
          silo: { select: { id: true, title: true } },
          vendor: { select: { id: true, name: true, title: true } },
        },
      });
    } catch {
      throw new ServiceUnavailableException(
        'Database tidak tersedia atau belum terkonfigurasi',
      );
    }
  }

  async findOne(id: string) {
    return await this.prisma.receiptInvoice.findUnique({
      where: { id },
      include: {
        incoming_document: {
          select: { id: true, title: true, document_receipt_date: true },
        },
        silo: { select: { id: true, title: true } },
        vendor: { select: { id: true, name: true, title: true } },
      },
    });
  }

  async update(id: string, updateReceiptInvoiceDto: UpdateReceiptInvoiceDto) {
    const data: UpdateReceiptInvoiceDto & {
      scan_date?: Date | string;
      upload_date?: Date | string;
    } = { ...updateReceiptInvoiceDto };
    if (typeof updateReceiptInvoiceDto?.scan_date === 'string') {
      data.scan_date = new Date(updateReceiptInvoiceDto.scan_date);
    }
    if (typeof updateReceiptInvoiceDto?.upload_date === 'string') {
      data.upload_date = new Date(updateReceiptInvoiceDto.upload_date);
    }
    return await this.prisma.receiptInvoice.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.receiptInvoice.delete({
      where: { id },
    });
  }
}
