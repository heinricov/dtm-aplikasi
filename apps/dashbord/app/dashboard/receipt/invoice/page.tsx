"use client";
import DataTable from "@/components/data-table";
import { Separator } from "@/components/ui/separator";
import {
  columns,
  getReceiptInvoiceRowId
} from "@/components/table/receipt-invoice";
import {
  deleteReceiptInvoices,
  getReceiptInvoices,
  type ReceiptInvoice
} from "@/services/receipt-invoice";
import { useEffect, useState } from "react";

export default function page() {
  const [data, setData] = useState<ReceiptInvoice[]>([]);
  const loadData = async () => {
    try {
      const list = await getReceiptInvoices();
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
            <h2 className="text-2xl font-bold">Receipt Invoice</h2>
            <p className="text-sm text-muted-foreground">
              Manage receipt invoices.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <DataTable
          columns={columns}
          data={data}
          filterKey="description"
          getRowId={getReceiptInvoiceRowId}
          onBulkDelete={async (ids) => {
            await deleteReceiptInvoices(ids);
            await loadData();
          }}
        />
      </div>
    </div>
  );
}
