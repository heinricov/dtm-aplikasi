import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentTypeModule } from './modules/document-type/document-type.module';
import { SiloModule } from './modules/silo/silo.module';

@Module({
  imports: [DocumentTypeModule, SiloModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
