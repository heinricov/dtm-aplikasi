import DataTable from "@/components/data-table";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/components/table/receipt-pl";
import { getReceiptPls, type ReceiptPl } from "@/services/receipt-pl";

export default async function page() {
  let data: ReceiptPl[] = [];
  try {
    data = await getReceiptPls();
  } catch {
    data = [];
  }
  return (
    <div className="mt-10">
      <div className="max-w-6xl mx-auto border border-border rounded-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Receipt Packing List</h2>
            <p className="text-sm text-muted-foreground">
              Manage receipt packing lists.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <DataTable columns={columns} data={data} filterKey="description" />
      </div>
    </div>
  );
}
