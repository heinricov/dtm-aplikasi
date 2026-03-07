export class CreateReceiptPlDto {
  incoming_document_id: string;
  silo_id: string;
  no_pl: string;
  ship_ref: string;
  scan_date?: string | Date;
  upload_date?: string | Date;
  description?: string;
}
