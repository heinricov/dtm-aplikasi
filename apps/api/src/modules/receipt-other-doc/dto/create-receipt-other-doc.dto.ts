export class CreateReceiptOtherDocDto {
  incoming_document_id: string;
  no_document: string;
  scan_date?: string | Date;
  upload_date?: string | Date;
  description?: string;
}
