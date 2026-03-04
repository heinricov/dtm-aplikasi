import DocumentTypeForm from "@/components/form/document-type";
import { FormDialog } from "@/components/form-dialog";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getDocumentTypes, type DocumentType } from "@/services/document-type";
import { columns } from "@/components/table/document-type";

export default async function page() {
  let data: DocumentType[] = [];
  try {
    data = await getDocumentTypes();
  } catch {
    data = [];
  }
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
          <FormDialog
            title="Add New Document Type"
            description="Add a new document type for incoming documents."
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
