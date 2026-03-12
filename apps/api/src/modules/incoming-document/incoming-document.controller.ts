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
import { IncomingDocumentService } from './incoming-document.service';
import { CreateIncomingDocumentDto } from './dto/create-incoming-document.dto';
import { UpdateIncomingDocumentDto } from './dto/update-incoming-document.dto';
import type { Response as ExpressResponse } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('incoming-document')
export class IncomingDocumentController {
  constructor(
    private readonly incomingDocumentService: IncomingDocumentService,
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() dto: CreateIncomingDocumentDto,
    @Res() res: ExpressResponse,
  ) {
    const { user_id, document_receipt_date, document_type_id, sender_id } =
      dto ?? {};
    if (!user_id || typeof user_id !== 'string' || user_id.trim() === '') {
      throw new BadRequestException('Field "user_id" wajib diisi');
    }
    if (
      !document_receipt_date ||
      (typeof document_receipt_date === 'string' &&
        document_receipt_date.trim() === '')
    ) {
      throw new BadRequestException(
        'Field "document_receipt_date" wajib diisi',
      );
    }
    if (
      !document_type_id ||
      typeof document_type_id !== 'string' ||
      document_type_id.trim() === ''
    ) {
      throw new BadRequestException('Field "document_type_id" wajib diisi');
    }
    if (
      !sender_id ||
      typeof sender_id !== 'string' ||
      sender_id.trim() === ''
    ) {
      throw new BadRequestException('Field "sender_id" wajib diisi');
    }
    const created = await this.incomingDocumentService.create({
      ...dto,
      document_receipt_date:
        typeof dto.document_receipt_date === 'string'
          ? new Date(dto.document_receipt_date)
          : dto.document_receipt_date,
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
      const data = await this.incomingDocumentService.findAll();
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
      const data = await this.incomingDocumentService.findOne(id);
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
    @Body() dto: UpdateIncomingDocumentDto,
    @Res() res: ExpressResponse,
  ) {
    const sanitized: UpdateIncomingDocumentDto = {};
    if (typeof dto?.user_id === 'string') {
      const v = dto.user_id.trim();
      if (v.length === 0) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Field "user_id" tidak boleh kosong',
          data: {},
        });
      }
      sanitized.user_id = v;
    }
    if (typeof dto?.document_type_id === 'string') {
      const v = dto.document_type_id.trim();
      if (v.length === 0) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Field "document_type_id" tidak boleh kosong',
          data: {},
        });
      }
      sanitized.document_type_id = v;
    }
    if (typeof dto?.sender_id === 'string') {
      const v = dto.sender_id.trim();
      if (v.length === 0) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: 'Field "sender_id" tidak boleh kosong',
          data: {},
        });
      }
      sanitized.sender_id = v;
    }
    if (typeof dto?.document_receipt_date === 'string') {
      sanitized.document_receipt_date = dto.document_receipt_date;
    } else if (dto?.document_receipt_date instanceof Date) {
      sanitized.document_receipt_date = dto.document_receipt_date;
    }
    if (typeof dto?.title === 'string') {
      sanitized.title = dto.title;
    }
    if (typeof dto?.qty === 'number') {
      sanitized.qty = dto.qty;
    }
    if (typeof dto?.note === 'string') {
      sanitized.note = dto.note;
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
    const updated = await this.incomingDocumentService.update(id, sanitized);
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
      await this.incomingDocumentService.remove(id);
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
