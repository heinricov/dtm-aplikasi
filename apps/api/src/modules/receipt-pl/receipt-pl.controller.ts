import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ParseUUIDPipe,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { ReceiptPlService } from './receipt-pl.service';
import { CreateReceiptPlDto } from './dto/create-receipt-pl.dto';
import { UpdateReceiptPlDto } from './dto/update-receipt-pl.dto';
import type { Response as ExpressResponse } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('receipt-pl')
export class ReceiptPlController {
  constructor(private readonly receiptPlService: ReceiptPlService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(@Body() dto: CreateReceiptPlDto, @Res() res: ExpressResponse) {
    const { incoming_document_id, silo_id, no_pl, ship_ref } = dto ?? {};
    if (
      !incoming_document_id ||
      typeof incoming_document_id !== 'string' ||
      incoming_document_id.trim() === ''
    ) {
      throw new BadRequestException('Field "incoming_document_id" wajib diisi');
    }
    if (!silo_id || typeof silo_id !== 'string' || silo_id.trim() === '') {
      throw new BadRequestException('Field "silo_id" wajib diisi');
    }
    if (!no_pl || typeof no_pl !== 'string' || no_pl.trim() === '') {
      throw new BadRequestException('Field "no_pl" wajib diisi');
    }
    if (!ship_ref || typeof ship_ref !== 'string' || ship_ref.trim() === '') {
      throw new BadRequestException('Field "ship_ref" wajib diisi');
    }
    const created = await this.receiptPlService.create({
      ...dto,
      scan_date:
        typeof dto.scan_date === 'string'
          ? new Date(dto.scan_date)
          : dto.scan_date,
      upload_date:
        typeof dto.upload_date === 'string'
          ? new Date(dto.upload_date)
          : dto.upload_date,
    });
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
      const data = await this.receiptPlService.findAll();
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
      const data = await this.receiptPlService.findOne(id);
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
    @Body() dto: UpdateReceiptPlDto,
    @Res() res: ExpressResponse,
  ) {
    const sanitized: UpdateReceiptPlDto = {};
    if (typeof dto?.incoming_document_id === 'string') {
      const v = dto.incoming_document_id.trim();
      if (v.length === 0) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Field "incoming_document_id" tidak boleh kosong',
          data: {},
        });
      }
      sanitized.incoming_document_id = v;
    }
    if (typeof dto?.silo_id === 'string') {
      const v = dto.silo_id.trim();
      if (v.length === 0) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Field "silo_id" tidak boleh kosong',
          data: {},
        });
      }
      sanitized.silo_id = v;
    }
    if (typeof dto?.no_pl === 'string') {
      const v = dto.no_pl.trim();
      if (v.length === 0) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Field "no_pl" tidak boleh kosong',
          data: {},
        });
      }
      sanitized.no_pl = v;
    }
    if (typeof dto?.ship_ref === 'string') {
      const v = dto.ship_ref.trim();
      if (v.length === 0) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Field "ship_ref" tidak boleh kosong',
          data: {},
        });
      }
      sanitized.ship_ref = v;
    }
    if (typeof dto?.scan_date === 'string') {
      sanitized.scan_date = dto.scan_date;
    } else if (dto?.scan_date instanceof Date) {
      sanitized.scan_date = dto.scan_date;
    }
    if (typeof dto?.upload_date === 'string') {
      sanitized.upload_date = dto.upload_date;
    } else if (dto?.upload_date instanceof Date) {
      sanitized.upload_date = dto.upload_date;
    }
    if (typeof dto?.description === 'string') {
      sanitized.description = dto.description;
    }
    if (Object.keys(sanitized).length === 0) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: 'Tidak ada field yang diupdate',
        data: {},
      });
    }
    const updated = await this.receiptPlService.update(id, sanitized);
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
      await this.receiptPlService.remove(id);
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
      });
    }
  }
}
