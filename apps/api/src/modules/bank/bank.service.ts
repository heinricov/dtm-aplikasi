import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BankService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createBankDto: CreateBankDto) {
    return await this.prismaService.bank.create({
      data: createBankDto,
    });
  }

  async findAll() {
    try {
      return await this.prismaService.bank.findMany();
    } catch {
      throw new ServiceUnavailableException(
        'Database tidak tersedia atau belum terkonfigurasi',
      );
    }
  }

  async findOne(id: string) {
    return await this.prismaService.bank.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateBankDto: UpdateBankDto) {
    return await this.prismaService.bank.update({
      where: { id },
      data: updateBankDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.bank.delete({
      where: { id },
    });
  }
}
