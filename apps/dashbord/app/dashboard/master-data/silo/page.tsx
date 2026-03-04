import { FormDialog } from "@/components/form/form-dialog";
import DataTable from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/components/table/silo";
import { getSilos, type Silo } from "@/services/silo";
import SiloForm from "@/components/form/silo";

export default async function page() {
  let data: Silo[] = [];
  try {
    data = await getSilos();
  } catch {
    data = [];
  }
  return (
    <div className="mt-10">
      <div className="max-w-6xl mx-auto border border-border rounded-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Silo</h2>
            <p className="text-sm text-muted-foreground">
              Manage silo for incoming documents.
            </p>
          </div>
          <FormDialog
            title="Add New Silo"
            description="Add a new silo for incoming documents."
            formFields={<SiloForm />}
            trigger={<Button className="mt-4">Add New</Button>}
          />
        </div>
        <Separator className="my-4" />
        <DataTable columns={columns} data={data} filterKey="title" />
      </div>
    </div>
  );
}
