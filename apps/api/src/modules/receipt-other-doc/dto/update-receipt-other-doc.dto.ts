import { PartialType } from '@nestjs/mapped-types';
import { CreateReceiptOtherDocDto } from './create-receipt-other-doc.dto';

export class UpdateReceiptOtherDocDto extends PartialType(CreateReceiptOtherDocDto) {}
