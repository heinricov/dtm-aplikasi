import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getIncomingDocuments,
  type IncomingDocument
} from "@/services/incoming-document";
import { getVendors, type Vendor } from "@/services/vendor";
import { getSilos, type Silo } from "@/services/silo";
import { columns as incomingDocumentColumns } from "./table/incoming-document";
import { columns as vendorColumns } from "./table/vendor";
import { columns as siloColumns } from "./table/silo";
import DataTable from "./data-table";

export default async function TabsDashboard() {
  let incoming: IncomingDocument[] = [];
  let vendors: Vendor[] = [];
  let silos: Silo[] = [];
  try {
    incoming = await getIncomingDocuments();
  } catch {
    incoming = [];
  }
  try {
    vendors = await getVendors();
  } catch {
    vendors = [];
  }
  try {
    silos = await getSilos();
  } catch {
    silos = [];
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
      name: "Vendor",
      value: "tab2",
      content: (
        <DataTable
          columns={vendorColumns}
          data={vendors}
          filterKey="description"
        />
      )
    },
    {
      name: "Silo",
      value: "tab3",
      content: (
        <DataTable columns={siloColumns} data={silos} filterKey="title" />
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
