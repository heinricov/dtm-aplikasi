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
import { ReceiptDo, deleteReceiptDo } from "@/services/receipt-do";
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

function ReceiptDoDetail({ item }: { item: ReceiptDo }) {
  const incomingDate =
    item?.incoming_document?.document_receipt_date ?? item?.scan_date ?? "";
  const siloText = item?.silo?.title || item?.silo_id || "";
  const vendorText =
    item?.vendor?.name || item?.vendor?.title || item?.vendor_id || "";
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="receipt-do-id">ID</FieldLabel>
        <Input id="receipt-do-id" value={item.id} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-do-incoming">Incoming Document</FieldLabel>
        <Input
          id="receipt-do-incoming"
          value={item.incoming_document_id}
          readOnly
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-do-silo">Silo</FieldLabel>
        <Input id="receipt-do-silo" value={siloText} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-do-vendor">Vendor</FieldLabel>
        <Input id="receipt-do-vendor" value={vendorText} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-do-no">DO Number</FieldLabel>
        <Input id="receipt-do-no" value={item.no_do ?? ""} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-do-pid">PID Number</FieldLabel>
        <Input id="receipt-do-pid" value={item.no_pid ?? ""} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-do-date">Receipt Date</FieldLabel>
        <Input id="receipt-do-date" value={formatDate(incomingDate)} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-do-desc">Description</FieldLabel>
        <Input id="receipt-do-desc" value={item.description ?? ""} readOnly />
      </Field>
    </FieldGroup>
  );
}

function RowActions({ item }: { item: ReceiptDo }) {
  const router = useRouter();
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  async function onDelete() {
    try {
      await deleteReceiptDo(item.id as string);
      toast.success("Receipt delivery order deleted");
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
        title="Delete Receipt Delivery Order?"
        description={
          <>
            This action cannot be undone. This will permanently delete
            <br />
            <strong>{item.no_do || item.id}</strong>.
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
          title="View Receipt Delivery Order"
          description="Detail receipt delivery order"
          formFields={<ReceiptDoDetail item={item} />}
        />
      </div>
    </>
  );
}

export const columns: ColumnDef<ReceiptDo>[] = [
  {
    accessorKey: "scan_date",
    header: "Receipt Date",
    cell: ({ row }) => <div>{formatDate(row.getValue("scan_date"))}</div>
  },
  {
    accessorKey: "incoming_document",
    header: "Incoming Document",
    cell: ({ row }) => {
      const o = row.original as ReceiptDo;
      const text = o?.incoming_document?.title || o?.incoming_document_id;
      return <div className="capitalize">{text}</div>;
    }
  },
  {
    accessorKey: "no_do",
    header: "DO No",
    cell: ({ row }) => <div className="capitalize">{row.getValue("no_do")}</div>
  },
  {
    accessorKey: "no_pid",
    header: "PID No",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("no_pid")}</div>
    )
  },
  {
    accessorKey: "silo",
    header: "Silo",
    cell: ({ row }) => {
      const o = row.original as ReceiptDo;
      const text = o?.silo?.title || o?.silo_id;
      return <div className="capitalize">{text}</div>;
    }
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => {
      const o = row.original as ReceiptDo;
      const text = o?.vendor?.name || o?.vendor?.title || o?.vendor_id;
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

export const getReceiptDoRowId = (row: ReceiptDo) => row.id;
