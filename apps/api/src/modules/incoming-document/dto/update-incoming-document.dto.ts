import { PartialType } from '@nestjs/mapped-types';
import { CreateIncomingDocumentDto } from './create-incoming-document.dto';

export class UpdateIncomingDocumentDto extends PartialType(CreateIncomingDocumentDto) {}
