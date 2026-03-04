import { FormDialog } from "@/components/form/form-dialog";
import DataTable from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/components/table/sender";
import { getSenders, type Sender } from "@/services/sender";
import SenderForm from "@/components/form/sender";

export default async function page() {
  let data: Sender[] = [];
  try {
    data = await getSenders();
  } catch {
    data = [];
  }
  return (
    <div className="mt-10">
      <div className="max-w-6xl mx-auto border border-border rounded-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Sender</h2>
            <p className="text-sm text-muted-foreground">
              Manage sender for incoming documents.
            </p>
          </div>
          <FormDialog
            title="Add New Sender"
            description="Add a new sender for incoming documents."
            formFields={<SenderForm />}
            trigger={<Button className="mt-4">Add New</Button>}
          />
        </div>
        <Separator className="my-4" />
        <DataTable columns={columns} data={data} filterKey="name" />
      </div>
    </div>
  );
}
