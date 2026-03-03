import { ReceiptDocumentDialog } from "@/components/form/receipt-document";
import DataTable from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function page() {
  return (
    <div className="mt-10">
      <div className="max-w-6xl mx-auto border border-border rounded-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Document Type</h2>
            <p className="text-sm text-muted-foreground">
              Manage document types for incoming documents.
            </p>
          </div>
          <ReceiptDocumentDialog
            trigger={<Button className="mt-4">Add New</Button>}
          />
        </div>
        <Separator className="my-4" />
        <DataTable />
      </div>
    </div>
  );
}
