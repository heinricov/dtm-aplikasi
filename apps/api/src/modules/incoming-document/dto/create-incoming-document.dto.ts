export class CreateIncomingDocumentDto {
  user_id: string;
  document_receipt_date: string | Date;
  title?: string;
  document_type_id: string;
  sender_id: string;
  qty?: number;
  note?: string;
  description?: string;
}
