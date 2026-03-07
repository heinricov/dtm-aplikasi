export class CreateReceiptDoDto {
  incoming_document_id: string;
  silo_id: string;
  vendor_id: string;
  no_do: string;
  no_pid: string;
  scan_date?: string | Date;
  upload_date?: string | Date;
  description?: string;
}
