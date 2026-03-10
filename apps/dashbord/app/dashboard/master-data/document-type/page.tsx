"use client";
import DocumentTypeForm from "@/components/form/document-type";
import { FormDialog } from "@/components/form-dialog";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  deleteDocumentTypes,
  getDocumentTypes,
  type DocumentType
} from "@/services/document-type";
import {
  columns,
  getDocumentTypeRowId
} from "@/components/table/document-type";
import { useEffect, useState } from "react";

export default function page() {
  const [data, setData] = useState<DocumentType[]>([]);
  const loadData = async () => {
    try {
      const list = await getDocumentTypes();
      setData(list);
    } catch {
      setData([]);
    }
  };
  useEffect(() => {
    void loadData();
  }, []);
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
        <DataTable
          columns={columns}
          data={data}
          filterKey="title"
          getRowId={getDocumentTypeRowId}
          onBulkDelete={async (ids) => {
            await deleteDocumentTypes(ids);
            await loadData();
          }}
        />
      </div>
    </div>
  );
}
