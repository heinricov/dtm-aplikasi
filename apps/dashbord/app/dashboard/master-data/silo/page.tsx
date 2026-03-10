"use client";
import { FormDialog } from "@/components/form-dialog";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { columns, getSiloRowId } from "@/components/table/silo";
import { deleteSilos, getSilos, type Silo } from "@/services/silo";
import SiloForm from "@/components/form/silo";
import { useEffect, useState } from "react";

export default function page() {
  const [data, setData] = useState<Silo[]>([]);
  const loadData = async () => {
    try {
      const list = await getSilos();
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
        <DataTable
          columns={columns}
          data={data}
          filterKey="title"
          getRowId={getSiloRowId}
          onBulkDelete={async (ids) => {
            await deleteSilos(ids);
            await loadData();
          }}
        />
      </div>
    </div>
  );
}
