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
import { ReceiptDoModule } from './modules/receipt-do/receipt-do.module';
import { ReceiptPlModule } from './modules/receipt-pl/receipt-pl.module';
import { ReceiptVpModule } from './modules/receipt-vp/receipt-vp.module';
import { ReceiptOtherDocModule } from './modules/receipt-other-doc/receipt-other-doc.module';

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
    ReceiptDoModule,
    ReceiptPlModule,
    ReceiptVpModule,
    ReceiptOtherDocModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
