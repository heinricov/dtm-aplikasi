import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateReceiptDoDto } from './dto/create-receipt-do.dto';
import { UpdateReceiptDoDto } from './dto/update-receipt-do.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReceiptDoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReceiptDoDto: CreateReceiptDoDto) {
    const scanDate =
      typeof createReceiptDoDto.scan_date === 'string'
        ? new Date(createReceiptDoDto.scan_date)
        : createReceiptDoDto.scan_date;
    const uploadDate =
      typeof createReceiptDoDto.upload_date === 'string'
        ? new Date(createReceiptDoDto.upload_date)
        : createReceiptDoDto.upload_date;
    return await this.prisma.receiptDo.create({
      data: {
        incoming_document_id: createReceiptDoDto.incoming_document_id,
        silo_id: createReceiptDoDto.silo_id,
        vendor_id: createReceiptDoDto.vendor_id,
        no_do: createReceiptDoDto.no_do,
        no_pid: createReceiptDoDto.no_pid,
        scan_date: scanDate ?? null,
        upload_date: uploadDate ?? null,
        description: createReceiptDoDto.description ?? null,
      },
    });
  }

  async findAll() {
    try {
      return await this.prisma.receiptDo.findMany({
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
    return await this.prisma.receiptDo.findUnique({
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

  async update(id: string, updateReceiptDoDto: UpdateReceiptDoDto) {
    const data: UpdateReceiptDoDto & {
      scan_date?: Date | string;
      upload_date?: Date | string;
    } = { ...updateReceiptDoDto };
    if (typeof updateReceiptDoDto?.scan_date === 'string') {
      data.scan_date = new Date(updateReceiptDoDto.scan_date);
    }
    if (typeof updateReceiptDoDto?.upload_date === 'string') {
      data.upload_date = new Date(updateReceiptDoDto.upload_date);
    }
    return await this.prisma.receiptDo.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.receiptDo.delete({
      where: { id },
    });
  }
}
