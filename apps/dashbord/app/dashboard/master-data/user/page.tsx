"use client";
import UserForm from "@/components/form/user";
import { FormDialog } from "@/components/form-dialog";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { columns, getUserRowId } from "@/components/table/user";
import { deleteUsers, getUsers, type User } from "@/services/user";
import { useEffect, useState } from "react";

export default function page() {
  const [data, setData] = useState<User[]>([]);
  const loadData = async () => {
    try {
      const list = await getUsers();
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
            <h2 className="text-2xl font-bold">User</h2>
            <p className="text-sm text-muted-foreground">
              Manage user for incoming documents.
            </p>
          </div>
          <FormDialog
            title="Add New Silo"
            description="Add a new silo for incoming documents."
            formFields={<UserForm />}
            trigger={<Button className="mt-4">Add New</Button>}
          />
        </div>
        <Separator className="my-4" />
        <DataTable
          columns={columns}
          data={data}
          filterKey="name"
          getRowId={getUserRowId}
          onBulkDelete={async (ids) => {
            await deleteUsers(ids);
            await loadData();
          }}
        />
      </div>
    </div>
  );
}
