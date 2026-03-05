import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateIncomingDocumentDto } from './dto/create-incoming-document.dto';
import { UpdateIncomingDocumentDto } from './dto/update-incoming-document.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class IncomingDocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createIncomingDocumentDto: CreateIncomingDocumentDto) {
    const dateValue =
      typeof createIncomingDocumentDto.document_receipt_date === 'string'
        ? new Date(createIncomingDocumentDto.document_receipt_date)
        : createIncomingDocumentDto.document_receipt_date;
    return await this.prisma.incomingDocument.create({
      data: {
        user_id: createIncomingDocumentDto.user_id,
        document_receipt_date: dateValue,
        title: createIncomingDocumentDto.title ?? null,
        document_type_id: createIncomingDocumentDto.document_type_id,
        sender_id: createIncomingDocumentDto.sender_id,
        qty: createIncomingDocumentDto.qty ?? null,
        note: createIncomingDocumentDto.note ?? null,
        description: createIncomingDocumentDto.description ?? null,
      },
    });
  }

  async findAll() {
    try {
      return await this.prisma.incomingDocument.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          document_type: { select: { id: true, title: true } },
          sender: { select: { id: true, name: true } },
        },
      });
    } catch {
      throw new ServiceUnavailableException(
        'Database tidak tersedia atau belum terkonfigurasi',
      );
    }
  }

  async findOne(id: string) {
    return await this.prisma.incomingDocument.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        document_type: { select: { id: true, title: true } },
        sender: { select: { id: true, name: true } },
      },
    });
  }

  async update(
    id: string,
    updateIncomingDocumentDto: UpdateIncomingDocumentDto,
  ) {
    const data: UpdateIncomingDocumentDto & {
      document_receipt_date?: Date | string;
    } = { ...updateIncomingDocumentDto };
    if (typeof updateIncomingDocumentDto?.document_receipt_date === 'string') {
      data.document_receipt_date = new Date(
        updateIncomingDocumentDto.document_receipt_date,
      );
    }
    if (data.title === '') {
      data.title = null as unknown as undefined;
    }
    if (data.note === '') {
      data.note = null as unknown as undefined;
    }
    if (data.description === '') {
      data.description = null as unknown as undefined;
    }
    return await this.prisma.incomingDocument.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.incomingDocument.delete({
      where: { id },
    });
  }
}
