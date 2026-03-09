import { FormDialog } from "@/components/form-dialog";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/components/table/incoming-document";
import {
  getIncomingDocuments,
  type IncomingDocument
} from "@/services/incoming-document";
import IncomingDocumentForm from "@/components/form/incoming-document";

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
            <h2 className="text-2xl font-bold">Incoming Document</h2>
            <p className="text-sm text-muted-foreground">
              Manage incoming documents.
            </p>
          </div>
          <FormDialog
            maxWidth="7xl"
            title="Add New Incoming Document"
            description="Add a new incoming document."
            formFields={<IncomingDocumentForm />}
            trigger={<Button className="mt-4">Add New</Button>}
          />
        </div>
        <Separator className="my-4" />
        <DataTable columns={columns} data={data} filterKey="description" />
      </div>
    </div>
  );
}
