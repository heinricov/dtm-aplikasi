import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateReceiptVpDto } from './dto/create-receipt-vp.dto';
import { UpdateReceiptVpDto } from './dto/update-receipt-vp.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReceiptVpService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReceiptVpDto: CreateReceiptVpDto) {
    const scanDate =
      typeof createReceiptVpDto.scan_date === 'string'
        ? new Date(createReceiptVpDto.scan_date)
        : createReceiptVpDto.scan_date;
    const uploadDate =
      typeof createReceiptVpDto.upload_date === 'string'
        ? new Date(createReceiptVpDto.upload_date)
        : createReceiptVpDto.upload_date;
    return await this.prisma.receiptVoucherPayment.create({
      data: {
        incoming_document_id: createReceiptVpDto.incoming_document_id,
        silo_id: createReceiptVpDto.silo_id,
        bank_id: createReceiptVpDto.bank_id,
        month: createReceiptVpDto.month,
        year: createReceiptVpDto.year,
        scan_date: scanDate ?? null,
        upload_date: uploadDate ?? null,
        description: createReceiptVpDto.description ?? null,
      },
    });
  }

  async findAll() {
    try {
      return await this.prisma.receiptVoucherPayment.findMany({
        include: {
          incoming_document: {
            select: { id: true, title: true, document_receipt_date: true },
          },
          silo: { select: { id: true, title: true } },
          bank: { select: { id: true, title: true } },
        },
      });
    } catch {
      throw new ServiceUnavailableException(
        'Database tidak tersedia atau belum terkonfigurasi',
      );
    }
  }

  async findOne(id: string) {
    return await this.prisma.receiptVoucherPayment.findUnique({
      where: { id },
      include: {
        incoming_document: {
          select: { id: true, title: true, document_receipt_date: true },
        },
        silo: { select: { id: true, title: true } },
        bank: { select: { id: true, title: true } },
      },
    });
  }

  async update(id: string, updateReceiptVpDto: UpdateReceiptVpDto) {
    const data: UpdateReceiptVpDto & {
      scan_date?: Date | string;
      upload_date?: Date | string;
    } = { ...updateReceiptVpDto };
    if (typeof updateReceiptVpDto?.scan_date === 'string') {
      data.scan_date = new Date(updateReceiptVpDto.scan_date);
    }
    if (typeof updateReceiptVpDto?.upload_date === 'string') {
      data.upload_date = new Date(updateReceiptVpDto.upload_date);
    }
    return await this.prisma.receiptVoucherPayment.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.receiptVoucherPayment.delete({
      where: { id },
    });
  }
}
