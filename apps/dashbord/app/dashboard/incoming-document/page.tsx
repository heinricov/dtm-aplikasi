"use client";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  columns,
  getIncomingDocumentRowId
} from "@/components/table/incoming-document";
import {
  deleteIncomingDocuments,
  getIncomingDocuments,
  type IncomingDocument
} from "@/services/incoming-document";
import { useEffect, useState } from "react";

export default function page() {
  const [data, setData] = useState<IncomingDocument[]>([]);
  const loadData = async () => {
    try {
      const list = await getIncomingDocuments();
      setData(list);
    } catch {
      setData([]);
    }
  };
  useEffect(() => {
    void loadData();
  }, []);
  useEffect(() => {
    const handler = () => {
      void loadData();
    };
    window.addEventListener("incoming-document:updated", handler);
    return () => {
      window.removeEventListener("incoming-document:updated", handler);
    };
  }, []);
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
          <Button className="mt-4">
            <a href="/dashboard/incoming-document/add-new">Add New</a>
          </Button>
        </div>
        <Separator className="my-4" />
        <DataTable
          columns={columns}
          data={data}
          filterKey="description"
          getRowId={getIncomingDocumentRowId}
          onBulkDelete={async (ids) => {
            await deleteIncomingDocuments(ids);
            await loadData();
          }}
        />
      </div>
    </div>
  );
}
