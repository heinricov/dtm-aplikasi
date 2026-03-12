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
import {
  ReceiptInvoice,
  deleteReceiptInvoice
} from "@/services/receipt-invoice";
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

function ReceiptInvoiceDetail({ item }: { item: ReceiptInvoice }) {
  const incomingDate =
    item?.incoming_document?.document_receipt_date ?? item?.scan_date ?? "";
  const siloText = item?.silo?.title || item?.silo_id || "";
  const vendorText =
    item?.vendor?.name || item?.vendor?.title || item?.vendor_id || "";
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="receipt-invoice-id">ID</FieldLabel>
        <Input id="receipt-invoice-id" value={item.id} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-invoice-incoming">
          Incoming Document
        </FieldLabel>
        <Input
          id="receipt-invoice-incoming"
          value={item.incoming_document_id}
          readOnly
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-invoice-silo">Silo</FieldLabel>
        <Input id="receipt-invoice-silo" value={siloText} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-invoice-vendor">Vendor</FieldLabel>
        <Input id="receipt-invoice-vendor" value={vendorText} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-invoice-no">Invoice Number</FieldLabel>
        <Input id="receipt-invoice-no" value={item.no_invoice ?? ""} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-invoice-po">PO Number</FieldLabel>
        <Input id="receipt-invoice-po" value={item.no_po ?? ""} readOnly />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-invoice-date">Receipt Date</FieldLabel>
        <Input
          id="receipt-invoice-date"
          value={formatDate(incomingDate)}
          readOnly
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="receipt-invoice-desc">Description</FieldLabel>
        <Input
          id="receipt-invoice-desc"
          value={item.description ?? ""}
          readOnly
        />
      </Field>
    </FieldGroup>
  );
}

function RowActions({ item }: { item: ReceiptInvoice }) {
  const router = useRouter();
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  async function onDelete() {
    try {
      await deleteReceiptInvoice(item.id as string);
      toast.success("Receipt invoice deleted");
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
        title="Delete Receipt Invoice?"
        description={
          <>
            This action cannot be undone. This will permanently delete
            <br />
            <strong>{item.no_invoice || item.id}</strong>.
          </>
        }
        confirmLabel="Delete"
        onConfirm={onDelete}
      />
      <div className="hidden">
        <FormDialog
          open={openView}
          onOpenChange={setOpenView}
          title="View Receipt Invoice"
          description="Detail receipt invoice"
          formFields={<ReceiptInvoiceDetail item={item} />}
        />
      </div>
    </>
  );
}

export const columns: ColumnDef<ReceiptInvoice>[] = [
  {
    accessorKey: "incoming_document",
    header: "Incoming Document",
    cell: ({ row }) => {
      const o = row.original as ReceiptInvoice;
      const text = o?.incoming_document?.title || o?.incoming_document_id;
      return <div className="capitalize">{text}</div>;
    }
  },
  {
    accessorKey: "no_invoice",
    header: "Invoice No",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("no_invoice")}</div>
    )
  },
  {
    accessorKey: "no_po",
    header: "PO No",
    cell: ({ row }) => <div className="capitalize">{row.getValue("no_po")}</div>
  },
  {
    accessorKey: "silo",
    header: "Silo",
    cell: ({ row }) => {
      const o = row.original as ReceiptInvoice;
      const text = o?.silo?.title || o?.silo_id;
      return <div className="capitalize">{text}</div>;
    }
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => {
      const o = row.original as ReceiptInvoice;
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

export const getReceiptInvoiceRowId = (row: ReceiptInvoice) => row.id;
