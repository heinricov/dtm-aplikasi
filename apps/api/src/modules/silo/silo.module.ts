import { Module } from '@nestjs/common';
import { SiloService } from './silo.service';
import { SiloController } from './silo.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SiloController],
  providers: [SiloService, PrismaService],
})
export class SiloModule {}
