import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateReceiptOtherDocDto } from './dto/create-receipt-other-doc.dto';
import { UpdateReceiptOtherDocDto } from './dto/update-receipt-other-doc.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReceiptOtherDocService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReceiptOtherDocDto: CreateReceiptOtherDocDto) {
    const scanDate =
      typeof createReceiptOtherDocDto.scan_date === 'string'
        ? new Date(createReceiptOtherDocDto.scan_date)
        : createReceiptOtherDocDto.scan_date;
    const uploadDate =
      typeof createReceiptOtherDocDto.upload_date === 'string'
        ? new Date(createReceiptOtherDocDto.upload_date)
        : createReceiptOtherDocDto.upload_date;
    return await this.prisma.receiptOtherDocument.create({
      data: {
        incoming_document_id: createReceiptOtherDocDto.incoming_document_id,
        no_document: createReceiptOtherDocDto.no_document,
        scan_date: scanDate ?? null,
        upload_date: uploadDate ?? null,
        description: createReceiptOtherDocDto.description ?? null,
      },
    });
  }

  async findAll() {
    try {
      return await this.prisma.receiptOtherDocument.findMany({
        include: {
          incoming_document: {
            select: { id: true, title: true, document_receipt_date: true },
          },
        },
      });
    } catch {
      throw new ServiceUnavailableException(
        'Database tidak tersedia atau belum terkonfigurasi',
      );
    }
  }

  async findOne(id: string) {
    return await this.prisma.receiptOtherDocument.findUnique({
      where: { id },
      include: {
        incoming_document: {
          select: { id: true, title: true, document_receipt_date: true },
        },
      },
    });
  }

  async update(id: string, updateReceiptOtherDocDto: UpdateReceiptOtherDocDto) {
    const data: UpdateReceiptOtherDocDto & {
      scan_date?: Date | string;
      upload_date?: Date | string;
    } = { ...updateReceiptOtherDocDto };
    if (typeof updateReceiptOtherDocDto?.scan_date === 'string') {
      data.scan_date = new Date(updateReceiptOtherDocDto.scan_date);
    }
    if (typeof updateReceiptOtherDocDto?.upload_date === 'string') {
      data.upload_date = new Date(updateReceiptOtherDocDto.upload_date);
    }
    return await this.prisma.receiptOtherDocument.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.receiptOtherDocument.delete({
      where: { id },
    });
  }
}
