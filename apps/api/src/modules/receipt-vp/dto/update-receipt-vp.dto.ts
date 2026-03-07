import { PartialType } from '@nestjs/mapped-types';
import { CreateReceiptVpDto } from './create-receipt-vp.dto';

export class UpdateReceiptVpDto extends PartialType(CreateReceiptVpDto) {}
