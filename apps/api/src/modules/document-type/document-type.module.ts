import { Module } from '@nestjs/common';
import { DocumentTypeService } from './document-type.service';
import { DocumentTypeController } from './document-type.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DocumentTypeController],
  providers: [DocumentTypeService, PrismaService],
})
export class DocumentTypeModule {}
