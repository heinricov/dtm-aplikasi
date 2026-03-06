import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentTypeModule } from './modules/document-type/document-type.module';
import { SiloModule } from './modules/silo/silo.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { BankModule } from './modules/bank/bank.module';
import { SenderModule } from './modules/sender/sender.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { IncomingDocumentModule } from './modules/incoming-document/incoming-document.module';
import { ReceiptInvoiceModule } from './modules/receipt-invoice/receipt-invoice.module';

@Module({
  imports: [
    DocumentTypeModule,
    SiloModule,
    VendorModule,
    BankModule,
    SenderModule,
    UserModule,
    AuthModule,
    IncomingDocumentModule,
    ReceiptInvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
