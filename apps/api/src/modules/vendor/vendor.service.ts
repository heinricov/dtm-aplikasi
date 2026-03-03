import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class VendorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createVendorDto: CreateVendorDto) {
    return await this.prismaService.vendor.create({
      data: createVendorDto,
    });
  }

  async findAll() {
    try {
      return await this.prismaService.vendor.findMany();
    } catch {
      throw new ServiceUnavailableException(
        'Database tidak tersedia atau belum terkonfigurasi',
      );
    }
  }

  async findOne(id: string) {
    return await this.prismaService.vendor.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateVendorDto: UpdateVendorDto) {
    return await this.prismaService.vendor.update({
      where: { id },
      data: updateVendorDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.vendor.delete({
      where: { id },
    });
  }
}
