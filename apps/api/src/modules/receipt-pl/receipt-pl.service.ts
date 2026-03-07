import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateReceiptPlDto } from './dto/create-receipt-pl.dto';
import { UpdateReceiptPlDto } from './dto/update-receipt-pl.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReceiptPlService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReceiptPlDto: CreateReceiptPlDto) {
    const scanDate =
      typeof createReceiptPlDto.scan_date === 'string'
        ? new Date(createReceiptPlDto.scan_date)
        : createReceiptPlDto.scan_date;
    const uploadDate =
      typeof createReceiptPlDto.upload_date === 'string'
        ? new Date(createReceiptPlDto.upload_date)
        : createReceiptPlDto.upload_date;
    return await this.prisma.receiptPl.create({
      data: {
        incoming_document_id: createReceiptPlDto.incoming_document_id,
        silo_id: createReceiptPlDto.silo_id,
        no_pl: createReceiptPlDto.no_pl,
        ship_ref: createReceiptPlDto.ship_ref,
        scan_date: scanDate ?? null,
        upload_date: uploadDate ?? null,
        description: createReceiptPlDto.description ?? null,
      },
    });
  }

  async findAll() {
    try {
      return await this.prisma.receiptPl.findMany({
        include: {
          incoming_document: {
            select: { id: true, title: true, document_receipt_date: true },
          },
          silo: { select: { id: true, title: true } },
        },
      });
    } catch {
      throw new ServiceUnavailableException(
        'Database tidak tersedia atau belum terkonfigurasi',
      );
    }
  }

  async findOne(id: string) {
    return await this.prisma.receiptPl.findUnique({
      where: { id },
      include: {
        incoming_document: {
          select: { id: true, title: true, document_receipt_date: true },
        },
        silo: { select: { id: true, title: true } },
      },
    });
  }

  async update(id: string, updateReceiptPlDto: UpdateReceiptPlDto) {
    const data: UpdateReceiptPlDto & {
      scan_date?: Date | string;
      upload_date?: Date | string;
    } = { ...updateReceiptPlDto };
    if (typeof updateReceiptPlDto?.scan_date === 'string') {
      data.scan_date = new Date(updateReceiptPlDto.scan_date);
    }
    if (typeof updateReceiptPlDto?.upload_date === 'string') {
      data.upload_date = new Date(updateReceiptPlDto.upload_date);
    }
    return await this.prisma.receiptPl.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.receiptPl.delete({
      where: { id },
    });
  }
}
