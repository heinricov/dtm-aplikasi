import DataTable from "@/components/data-table";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/components/table/incoming-document";
import {
  getIncomingDocuments,
  type IncomingDocument
} from "@/services/incoming-document";

export default async function page() {
  let data: IncomingDocument[] = [];
  try {
    data = await getIncomingDocuments();
  } catch {
    data = [];
  }
  return (
    <div className="mt-10">
      <div className="max-w-6xl mx-auto border border-border rounded-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Incoming Invoice</h2>
            <p className="text-sm text-muted-foreground">
              Manage incoming invoices.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <DataTable columns={columns} data={data} filterKey="description" />
      </div>
    </div>
  );
}
