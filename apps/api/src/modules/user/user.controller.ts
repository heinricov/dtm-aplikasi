import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Res,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() res: ExpressResponse,
  ) {
    const { name, email, password } = createUserDto ?? {};
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new BadRequestException('Field "name" wajib diisi');
    }
    if (!email || typeof email !== 'string' || email.trim() === '') {
      throw new BadRequestException('Field "email" wajib diisi');
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
      throw new BadRequestException('Field "password" wajib diisi');
    }
    const created = await this.userService.create(createUserDto);
    const { password: _pwdCreate, ...safe } = (created ?? {}) as Record<
      string,
      unknown
    >;
    return res.status(201).json({
      status: true,
      code: 201,
      message: 'Created',
      data: safe,
    });
  }

  @Get()
  async findAll(@Res() res: ExpressResponse) {
    try {
      const data = await this.userService.findAll();
      const safeData = Array.isArray(data)
        ? data.map((u) => {
            const { password: _pwdList, ...rest } = (u ?? {}) as Record<
              string,
              unknown
            >;
            return rest;
          })
        : [];
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'OK',
        qty: Array.isArray(safeData) ? safeData.length : 0,
        data: Array.isArray(safeData) ? safeData : [],
      });
    } catch (err) {
      const anyErr = err as { getStatus?: () => number; message?: string };
      const code = anyErr?.getStatus?.() ?? 503;
      const message = anyErr?.message ?? 'Service Unavailable';
      return res.status(code).json({
        status: false,
        code,
        message,
        qty: 0,
        data: [],
      });
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: ExpressResponse,
  ) {
    try {
      const data = await this.userService.findOne(id);
      if (!data) {
        return res.status(404).json({
          status: false,
          code: 404,
          message: 'Not Found',
          data: {},
        });
      }
      const { password: _pwdDetail, ...safe } = (data ?? {}) as Record<
        string,
        unknown
      >;
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'OK',
        data: safe,
      });
    } catch (err) {
      const anyErr = err as { getStatus?: () => number; message?: string };
      const code = anyErr?.getStatus?.() ?? 503;
      const message = anyErr?.message ?? 'Service Unavailable';
      return res.status(code).json({
        status: false,
        code,
        message,
        data: {},
      });
    }
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: ExpressResponse,
  ) {
    const sanitized: UpdateUserDto = {};
    if (typeof updateUserDto?.name === 'string') {
      const n = updateUserDto.name.trim();
      if (n.length === 0) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Field "name" tidak boleh kosong',
          data: {},
        });
      }
      sanitized.name = n;
    }
    if (typeof updateUserDto?.email === 'string') {
      const e = updateUserDto.email.trim();
      if (e.length === 0) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Field "email" tidak boleh kosong',
          data: {},
        });
      }
      sanitized.email = e;
    }
    if (typeof updateUserDto?.password === 'string') {
      const p = updateUserDto.password.trim();
      if (p.length === 0) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Field "password" tidak boleh kosong',
          data: {},
        });
      }
      sanitized.password = p;
    }
    if (typeof updateUserDto?.role === 'string') {
      sanitized.role = updateUserDto.role;
    }
    if (Object.keys(sanitized).length === 0) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: 'Tidak ada field yang diupdate',
        data: {},
      });
    }
    const updated = await this.userService.update(id, sanitized);
    const { password: _pwdUpdate, ...safe } = (updated ?? {}) as Record<
      string,
      unknown
    >;
    return res.status(200).json({
      status: true,
      code: 200,
      message: 'Updated',
      data: safe,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: ExpressResponse,
  ) {
    try {
      await this.userService.remove(id);
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Deleted',
        data: {},
      });
    } catch (err) {
      const anyErr = err as {
        code?: string;
        getStatus?: () => number;
        message?: string;
      };
      const isNotFound = anyErr?.code === 'P2025';
      const code = isNotFound ? 404 : (anyErr?.getStatus?.() ?? 503);
      const message = isNotFound
        ? 'Not Found'
        : (anyErr?.message ?? 'Service Unavailable');
      return res.status(code).json({
        status: false,
        code,
        message,
        data: {},
      });
    }
  }
}
