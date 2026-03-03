import DocumentTypeForm from "@/components/form/document-type";
import { FormDialog } from "@/components/form/form-dialog";
import DataTable from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/components/table/vendor";
import { getVendors, type Vendor } from "@/services/vendor";

export default async function page() {
  let data: Vendor[] = [];
  try {
    data = await getVendors();
  } catch {
    data = [];
  }
  return (
    <div className="mt-10">
      <div className="max-w-6xl mx-auto border border-border rounded-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Vendor</h2>
            <p className="text-sm text-muted-foreground">
              Manage vendor for incoming documents.
            </p>
          </div>
          <FormDialog
            title="Add New Vendor"
            description="Add a new vendor for incoming documents."
            formFields={<DocumentTypeForm />}
            trigger={<Button className="mt-4">Add New</Button>}
          />
        </div>
        <Separator className="my-4" />
        <DataTable columns={columns} data={data} filterKey="title" />
      </div>
    </div>
  );
}
