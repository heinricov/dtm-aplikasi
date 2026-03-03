import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentTypeModule } from './modules/document-type/document-type.module';
import { SiloModule } from './modules/silo/silo.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { BankModule } from './modules/bank/bank.module';

@Module({
  imports: [DocumentTypeModule, SiloModule, VendorModule, BankModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
