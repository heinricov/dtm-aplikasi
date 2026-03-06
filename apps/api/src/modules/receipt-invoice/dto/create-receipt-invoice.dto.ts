export class CreateReceiptInvoiceDto {
  incoming_document_id: string;
  silo_id: string;
  vendor_id: string;
  no_invoice?: string;
  no_po?: string;
  scan_date?: string | Date;
  upload_date?: string | Date;
  description?: string;
}
