"use client";
import DataTable from "@/components/data-table";
import { Separator } from "@/components/ui/separator";
import { columns, getReceiptDoRowId } from "@/components/table/receipt-do";
import {
  deleteReceiptDos,
  getReceiptDos,
  type ReceiptDo
} from "@/services/receipt-do";
import { useEffect, useState } from "react";

export default function page() {
  const [data, setData] = useState<ReceiptDo[]>([]);
  const loadData = async () => {
    try {
      const list = await getReceiptDos();
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
            <h2 className="text-2xl font-bold">Receipt Delivery Order</h2>
            <p className="text-sm text-muted-foreground">
              Manage receipt delivery orders.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <DataTable
          columns={columns}
          data={data}
          filterKey="description"
          getRowId={getReceiptDoRowId}
          onBulkDelete={async (ids) => {
            await deleteReceiptDos(ids);
            await loadData();
          }}
        />
      </div>
    </div>
  );
}
