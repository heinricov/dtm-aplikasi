import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DocumentTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDocumentTypeDto: CreateDocumentTypeDto) {
    return await this.prismaService.documentType.create({
      data: createDocumentTypeDto,
    });
  }

  async findAll() {
    try {
      return await this.prismaService.documentType.findMany();
    } catch {
      throw new ServiceUnavailableException(
        'Database tidak tersedia atau belum terkonfigurasi',
      );
    }
  }

  async findOne(id: string) {
    return await this.prismaService.documentType.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateDocumentTypeDto: UpdateDocumentTypeDto) {
    return await this.prismaService.documentType.update({
      where: {
        id,
      },
      data: updateDocumentTypeDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.documentType.delete({
      where: {
        id,
      },
    });
  }
}
