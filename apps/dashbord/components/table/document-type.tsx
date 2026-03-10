"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import DocumentTypeForm from "@/components/form/document-type";
import { FormDialog } from "@/components/form-dialog";
import { DocumentType, deleteDocumentType } from "@/services/document-type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confrim-dialog";

function RowActions({ item }: { item: DocumentType }) {
  const router = useRouter();
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  async function onDelete() {
    try {
      await deleteDocumentType(item.id as string);
      toast.success("Document type deleted");
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
        title="Delete Document Type?"
        description={
          <>
            This action cannot be undone. This will permanently delete
            <br />
            <strong>{item.title}</strong>.
          </>
        }
        confirmLabel="Delete"
        onConfirm={onDelete}
      />
      <div className="hidden">
        <FormDialog
          open={openView}
          onOpenChange={setOpenView}
          title="View Document Type"
          description="Detail document type"
          formFields={<DocumentTypeForm mode="view" initial={item} />}
        />
        <FormDialog
          open={openEdit}
          onOpenChange={setOpenEdit}
          title="Edit Document Type"
          description="Update the document type"
          formFields={<DocumentTypeForm mode="edit" initial={item} />}
        />
      </div>
    </>
  );
}

export const columns: ColumnDef<DocumentType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>
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

export const getDocumentTypeRowId = (row: DocumentType) => row.id;
