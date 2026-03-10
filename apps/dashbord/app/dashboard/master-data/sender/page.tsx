"use client";
import { FormDialog } from "@/components/form-dialog";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { columns, getSenderRowId } from "@/components/table/sender";
import { deleteSenders, getSenders, type Sender } from "@/services/sender";
import SenderForm from "@/components/form/sender";
import { useEffect, useState } from "react";

export default function page() {
  const [data, setData] = useState<Sender[]>([]);
  const loadData = async () => {
    try {
      const list = await getSenders();
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
        <DataTable
          columns={columns}
          data={data}
          filterKey="name"
          getRowId={getSenderRowId}
          onBulkDelete={async (ids) => {
            await deleteSenders(ids);
            await loadData();
          }}
        />
      </div>
    </div>
  );
}
