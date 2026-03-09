"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import IncomingDocumentForm from "@/components/form/incoming-document";
import { FormDialog } from "@/components/form-dialog";
import {
  IncomingDocument,
  deleteIncomingDocument
} from "@/services/incoming-document";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confrim-dialog";

function RowActions({ item }: { item: IncomingDocument }) {
  const router = useRouter();
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  async function onDelete() {
    try {
      await deleteIncomingDocument(item.id as string);
      toast.success("Incoming document deleted");
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
              setOpenEdit(true);
            }}
          >
            <Pencil className="h-4 w-4 text-blue-500" />
            Edit
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
        title="Delete Incoming Document?"
        description={
          <>
            This action cannot be undone. This will permanently delete
            <br />
            <strong>{item.description || item.id}</strong>.
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
          title="View Incoming Document"
          description="Detail incoming document"
          formFields={<IncomingDocumentForm mode="view" initial={item} />}
        />
        <FormDialog
          maxWidth="5xl"
          open={openEdit}
          onOpenChange={setOpenEdit}
          title="Edit Incoming Document"
          description="Update the incoming document"
          formFields={<IncomingDocumentForm mode="edit" initial={item} />}
        />
      </div>
    </>
  );
}

export const columns: ColumnDef<IncomingDocument>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "document_receipt_date",
    header: "Receipt Date",
    cell: ({ row }) => (
      <div>{String(row.getValue("document_receipt_date")).slice(0, 10)}</div>
    )
  },
  {
    accessorKey: "sender",
    header: "Sender",
    cell: ({ row }) => {
      const o = row.original as IncomingDocument;
      const text = o?.sender?.name || o?.sender_id;
      return <div className="capitalize">{text}</div>;
    }
  },
  {
    accessorKey: "user",
    header: "Recipient",
    cell: ({ row }) => {
      const o = row.original as IncomingDocument;
      const text = o?.user?.name || o?.user_id;
      return <div className="capitalize">{text}</div>;
    }
  },
  {
    accessorKey: "document_type",
    header: "Doc. Type",
    cell: ({ row }) => {
      const o = row.original as IncomingDocument;
      const text = o?.document_type?.title || o?.document_type_id;
      return <div className="capitalize">{text}</div>;
    }
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>
  },
  {
    accessorKey: "qty",
    header: "Qty",
    cell: ({ row }) => <div>{row.getValue("qty") as number}</div>
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    )
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => <div className="capitalize">{row.getValue("note")}</div>
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions item={row.original} />
  }
];
