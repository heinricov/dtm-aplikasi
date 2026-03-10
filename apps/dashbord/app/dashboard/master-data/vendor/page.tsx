"use client";
import { FormDialog } from "@/components/form-dialog";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { columns, getVendorRowId } from "@/components/table/vendor";
import { deleteVendors, getVendors, type Vendor } from "@/services/vendor";
import VendorForm from "@/components/form/vendor";
import { useEffect, useState } from "react";

export default function page() {
  const [data, setData] = useState<Vendor[]>([]);
  const loadData = async () => {
    try {
      const list = await getVendors();
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
            <h2 className="text-2xl font-bold">Vendor</h2>
            <p className="text-sm text-muted-foreground">
              Manage vendor for incoming documents.
            </p>
          </div>
          <FormDialog
            title="Add New Vendor"
            description="Add a new vendor for incoming documents."
            formFields={<VendorForm />}
            trigger={<Button className="mt-4">Add New</Button>}
          />
        </div>
        <Separator className="my-4" />
        <DataTable
          columns={columns}
          data={data}
          filterKey="title"
          getRowId={getVendorRowId}
          onBulkDelete={async (ids) => {
            await deleteVendors(ids);
            await loadData();
          }}
        />
      </div>
    </div>
  );
}
