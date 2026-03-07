export class CreateReceiptVpDto {
  incoming_document_id: string;
  silo_id: string;
  bank_id: string;
  month: number;
  year: number;
  scan_date?: string | Date;
  upload_date?: string | Date;
  description?: string;
}
