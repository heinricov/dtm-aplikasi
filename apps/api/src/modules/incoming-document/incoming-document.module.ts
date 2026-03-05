import { Module } from '@nestjs/common';
import { IncomingDocumentService } from './incoming-document.service';
import { IncomingDocumentController } from './incoming-document.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [IncomingDocumentController],
  providers: [IncomingDocumentService, PrismaService],
})
export class IncomingDocumentModule {}
