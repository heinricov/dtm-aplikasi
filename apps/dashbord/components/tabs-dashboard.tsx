import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getIncomingDocuments,
  type IncomingDocument
} from "@/services/incoming-document";
import {
  getReceiptInvoices,
  type ReceiptInvoice
} from "@/services/receipt-invoice";
import { getReceiptPls, type ReceiptPl } from "@/services/receipt-pl";
import { getReceiptDos, type ReceiptDo } from "@/services/receipt-do";
import { columns as incomingDocumentColumns } from "./table/incoming-document";
import { columns as invoiceColumns } from "./table/receipt-invoice";
import { columns as doColumns } from "./table/receipt-do";
import { columns as plColumns } from "./table/receipt-pl";
import DataTable from "./data-table";

export default async function TabsDashboard() {
  let incoming: IncomingDocument[] = [];
  let invoices: ReceiptInvoice[] = [];
  let deliveryOrders: ReceiptDo[] = [];
  let packingList: ReceiptPl[] = [];

  try {
    incoming = await getIncomingDocuments();
  } catch {
    incoming = [];
  }
  try {
    invoices = await getReceiptInvoices();
  } catch {
    invoices = [];
  }
  try {
    deliveryOrders = await getReceiptDos();
  } catch {
    deliveryOrders = [];
  }
  try {
    packingList = await getReceiptPls();
  } catch {
    packingList = [];
  }

  const tabs = [
    {
      name: "Incoming Document",
      value: "tab1",
      content: (
        <DataTable
          columns={incomingDocumentColumns}
          data={incoming}
          filterKey="description"
        />
      )
    },
    {
      name: "Invoice",
      value: "tab2",
      content: (
        <DataTable
          columns={invoiceColumns}
          data={invoices}
          filterKey="description"
        />
      )
    },
    {
      name: "Delivery Order",
      value: "tab3",
      content: (
        <DataTable
          columns={doColumns}
          data={deliveryOrders}
          filterKey="no_do"
        />
      )
    },
    {
      name: "Packing List",
      value: "tab4",
      content: (
        <DataTable columns={plColumns} data={packingList} filterKey="no_pl" />
      )
    }
  ];
  return (
    <Tabs className="w-full max-w-7xl" defaultValue={tabs[0].value}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            <code className="text-[13px]">{tab.name}</code>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="text-[13px]">{tab.content}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
