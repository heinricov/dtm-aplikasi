import { PartialType } from '@nestjs/mapped-types';
import { CreateReceiptPlDto } from './create-receipt-pl.dto';

export class UpdateReceiptPlDto extends PartialType(CreateReceiptPlDto) {}
