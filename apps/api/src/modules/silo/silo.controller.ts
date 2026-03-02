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
import { SiloService } from './silo.service';
import { CreateSiloDto } from './dto/create-silo.dto';
import { UpdateSiloDto } from './dto/update-silo.dto';

@Controller('silo')
export class SiloController {
  constructor(private readonly siloService: SiloService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() createSiloDto: CreateSiloDto,
    @Res() res: ExpressResponse,
  ) {
    const { title } = createSiloDto ?? {};
    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new BadRequestException('Field "title" wajib diisi');
    }
    const created = await this.siloService.create(createSiloDto);
    return res.status(201).json({
      status: true,
      code: 201,
      message: 'Created',
      data: created,
    });
  }

  @Get()
  async findAll(@Res() res: ExpressResponse) {
    try {
      const data = await this.siloService.findAll();
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'OK',
        qty: Array.isArray(data) ? data.length : 0,
        data: Array.isArray(data) ? data : [],
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
      const data = await this.siloService.findOne(id);
      if (!data) {
        return res.status(404).json({
          status: false,
          code: 404,
          message: 'Not Found',
          data: {},
        });
      }
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'OK',
        data,
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
    @Body() updateSiloDto: UpdateSiloDto,
    @Res() res: ExpressResponse,
  ) {
    const sanitized: UpdateSiloDto = {};
    if (typeof updateSiloDto?.title === 'string') {
      const t = updateSiloDto.title.trim();
      if (t.length === 0) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Field "title" tidak boleh kosong',
          data: {},
        });
      }
      sanitized.title = t;
    }
    if (typeof updateSiloDto?.description === 'string') {
      sanitized.description = updateSiloDto.description;
    }
    if (Object.keys(sanitized).length === 0) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: 'Tidak ada field yang diupdate',
        data: {},
      });
    }
    const updated = await this.siloService.update(id, sanitized);
    return res.status(200).json({
      status: true,
      code: 200,
      message: 'Updated',
      data: updated,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: ExpressResponse,
  ) {
    try {
      await this.siloService.remove(id);
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
