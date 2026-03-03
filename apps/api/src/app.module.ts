import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentTypeModule } from './modules/document-type/document-type.module';
import { SiloModule } from './modules/silo/silo.module';
import { VendorModule } from './modules/vendor/vendor.module';

@Module({
  imports: [DocumentTypeModule, SiloModule, VendorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
