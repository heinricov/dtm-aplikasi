import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateSiloDto } from './dto/create-silo.dto';
import { UpdateSiloDto } from './dto/update-silo.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SiloService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSiloDto: CreateSiloDto) {
    return await this.prismaService.silo.create({
      data: createSiloDto,
    });
  }

  async findAll() {
    try {
      return await this.prismaService.silo.findMany();
    } catch {
      throw new ServiceUnavailableException(
        'Database tidak tersedia atau belum terkonfigurasi',
      );
    }
  }

  async findOne(id: string) {
    return await this.prismaService.silo.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateSiloDto: UpdateSiloDto) {
    return await this.prismaService.silo.update({
      where: { id },
      data: updateSiloDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.silo.delete({
      where: { id },
    });
  }
}
