import { PartialType } from '@nestjs/mapped-types';
import { CreateReceiptInvoiceDto } from './create-receipt-invoice.dto';

export class UpdateReceiptInvoiceDto extends PartialType(CreateReceiptInvoiceDto) {}
