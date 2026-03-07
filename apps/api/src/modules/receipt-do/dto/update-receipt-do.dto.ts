import { PartialType } from '@nestjs/mapped-types';
import { CreateReceiptDoDto } from './create-receipt-do.dto';

export class UpdateReceiptDoDto extends PartialType(CreateReceiptDoDto) {}
