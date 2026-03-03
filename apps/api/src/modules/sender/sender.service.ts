import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateSenderDto } from './dto/create-sender.dto';
import { UpdateSenderDto } from './dto/update-sender.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SenderService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSenderDto: CreateSenderDto) {
    return await this.prismaService.sender.create({
      data: createSenderDto,
    });
  }

  async findAll() {
    try {
      return await this.prismaService.sender.findMany();
    } catch {
      throw new ServiceUnavailableException(
        'Database tidak tersedia atau belum terkonfigurasi',
      );
    }
  }

  async findOne(id: string) {
    return await this.prismaService.sender.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateSenderDto: UpdateSenderDto) {
    return await this.prismaService.sender.update({
      where: { id },
      data: updateSenderDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.sender.delete({
      where: { id },
    });
  }
}
