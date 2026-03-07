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
import { ReceiptVpService } from './receipt-vp.service';
import { CreateReceiptVpDto } from './dto/create-receipt-vp.dto';
import { UpdateReceiptVpDto } from './dto/update-receipt-vp.dto';
import type { Response as ExpressResponse } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('receipt-vp')
export class ReceiptVpController {
  constructor(private readonly receiptVpService: ReceiptVpService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(@Body() dto: CreateReceiptVpDto, @Res() res: ExpressResponse) {
    const { incoming_document_id, silo_id, bank_id, month, year } = dto ?? {};
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
    if (!bank_id || typeof bank_id !== 'string' || bank_id.trim() === '') {
      throw new BadRequestException('Field "bank_id" wajib diisi');
    }
    if (typeof month !== 'number' || Number.isNaN(month)) {
      throw new BadRequestException('Field "month" wajib diisi');
    }
    if (typeof year !== 'number' || Number.isNaN(year)) {
      throw new BadRequestException('Field "year" wajib diisi');
    }
    const created = await this.receiptVpService.create({
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
      const data = await this.receiptVpService.findAll();
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
      const data = await this.receiptVpService.findOne(id);
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
    @Body() dto: UpdateReceiptVpDto,
    @Res() res: ExpressResponse,
  ) {
    const sanitized: UpdateReceiptVpDto = {};
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
    if (typeof dto?.bank_id === 'string') {
      const v = dto.bank_id.trim();
      if (v.length === 0) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Field "bank_id" tidak boleh kosong',
          data: {},
        });
      }
      sanitized.bank_id = v;
    }
    if (typeof dto?.month === 'number') {
      sanitized.month = dto.month;
    }
    if (typeof dto?.year === 'number') {
      sanitized.year = dto.year;
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
    const updated = await this.receiptVpService.update(id, sanitized);
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
      await this.receiptVpService.remove(id);
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
