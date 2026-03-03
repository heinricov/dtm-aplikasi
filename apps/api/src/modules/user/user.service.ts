import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashed =
      typeof createUserDto.password === 'string'
        ? await bcrypt.hash(createUserDto.password, 10)
        : undefined;
    return await this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashed ?? createUserDto.password,
        role: createUserDto.role ?? null,
      },
    });
  }

  async findAll() {
    try {
      return await this.prismaService.user.findMany();
    } catch {
      throw new ServiceUnavailableException(
        'Database tidak tersedia atau belum terkonfigurasi',
      );
    }
  }

  async findOne(id: string) {
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data: UpdateUserDto & { password?: string | null } = {
      ...updateUserDto,
    };
    if (typeof updateUserDto?.password === 'string') {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return await this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prismaService.user.delete({
      where: { id },
    });
  }
}
