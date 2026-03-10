"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Eye, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { FormDialog } from "@/components/form-dialog";
import { ReceiptPl, deleteReceiptPl } from "@/services/receipt-pl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confrim-dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

function formatDate(value: unknown) {
  if (!value) return "-";
  const text = String(value);
  return text.length >= 10 ? text.slice(0, 10) : text;
}

function ReceiptPlDetail({ item }: { item: ReceiptPl }) {
  const incomingDate =
    item?.incoming_document?.document_receipt_date ?? item?.scan_date ?? "";
  const siloText = item?.silo?.title || item?.silo_id || "";
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="receipt-pl-id">ID</FieldLabel>
        <Input id="receipt-pl-id" value={item.id} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-pl-incoming">Incoming Document</FieldLabel>
        <Input
          id="receipt-pl-incoming"
          value={item.incoming_document_id}
          readOnly
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-pl-silo">Silo</FieldLabel>
        <Input id="receipt-pl-silo" value={siloText} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-pl-no">Packing List Number</FieldLabel>
        <Input id="receipt-pl-no" value={item.no_pl ?? ""} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-pl-ship-ref">Ship Ref</FieldLabel>
        <Input id="receipt-pl-ship-ref" value={item.ship_ref ?? ""} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-pl-date">Receipt Date</FieldLabel>
        <Input id="receipt-pl-date" value={formatDate(incomingDate)} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-pl-desc">Description</FieldLabel>
        <Input id="receipt-pl-desc" value={item.description ?? ""} readOnly />
      </Field>
    </FieldGroup>
  );
}

function RowActions({ item }: { item: ReceiptPl }) {
  const router = useRouter();
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  async function onDelete() {
    try {
      await deleteReceiptPl(item.id as string);
      toast.success("Receipt packing list deleted");
      router.refresh();
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "Failed to delete";
      toast.error(message);
    }
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setOpenView(true);
            }}
          >
            <Eye />
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setOpenDelete(true);
            }}
          >
            <Trash className="h-4 w-4 text-red-500" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Delete Receipt Packing List?"
        description={
          <>
            This action cannot be undone. This will permanently delete
            <br />
            <strong>{item.no_pl || item.id}</strong>.
          </>
        }
        confirmLabel="Delete"
        onConfirm={onDelete}
      />
      <div className="hidden">
        <FormDialog
          maxWidth="5xl"
          open={openView}
          onOpenChange={setOpenView}
          title="View Receipt Packing List"
          description="Detail receipt packing list"
          formFields={<ReceiptPlDetail item={item} />}
        />
      </div>
    </>
  );
}

export const columns: ColumnDef<ReceiptPl>[] = [
  {
    accessorKey: "scan_date",
    header: "Receipt Date",
    cell: ({ row }) => <div>{formatDate(row.getValue("scan_date"))}</div>
  },
  {
    accessorKey: "incoming_document",
    header: "Incoming Document",
    cell: ({ row }) => {
      const o = row.original as ReceiptPl;
      const text = o?.incoming_document?.title || o?.incoming_document_id;
      return <div className="capitalize">{text}</div>;
    }
  },
  {
    accessorKey: "no_pl",
    header: "PL No",
    cell: ({ row }) => <div className="capitalize">{row.getValue("no_pl")}</div>
  },
  {
    accessorKey: "ship_ref",
    header: "Ship Ref",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("ship_ref")}</div>
    )
  },
  {
    accessorKey: "silo",
    header: "Silo",
    cell: ({ row }) => {
      const o = row.original as ReceiptPl;
      const text = o?.silo?.title || o?.silo_id;
      return <div className="capitalize">{text}</div>;
    }
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    )
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions item={row.original} />
  }
];

export const getReceiptPlRowId = (row: ReceiptPl) => row.id;
