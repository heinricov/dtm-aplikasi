"use client";
import { FormDialog } from "@/components/form-dialog";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { columns, getBankRowId } from "@/components/table/bank";
import { deleteBanks, getBanks, type Bank } from "@/services/bank";
import BankForm from "@/components/form/bank";
import { useEffect, useState } from "react";

export default function page() {
  const [data, setData] = useState<Bank[]>([]);
  const loadData = async () => {
    try {
      const list = await getBanks();
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
            <h2 className="text-2xl font-bold">Bank</h2>
            <p className="text-sm text-muted-foreground">
              Manage bank for incoming documents.
            </p>
          </div>
          <FormDialog
            title="Add New Bank"
            description="Add a new bank for incoming documents."
            formFields={<BankForm />}
            trigger={<Button className="mt-4">Add New</Button>}
          />
        </div>
        <Separator className="my-4" />
        <DataTable
          columns={columns}
          data={data}
          filterKey="title"
          getRowId={getBankRowId}
          onBulkDelete={async (ids) => {
            await deleteBanks(ids);
            await loadData();
          }}
        />
      </div>
    </div>
  );
}
