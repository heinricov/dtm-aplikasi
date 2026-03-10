"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { toast } from "sonner";

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  filterKey?: string;
  getRowId?: (row: TData) => string;
  onBulkDelete?: (ids: string[]) => Promise<void>;
}

export default function DataTable<TData>({
  columns,
  data,
  filterKey,
  getRowId,
  onBulkDelete
}: DataTableProps<TData>) {
  const selectionColumn = React.useMemo<ColumnDef<TData>>(
    () => ({
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
    }),
    []
  );
  const columnsWithSelect = React.useMemo(
    () => [selectionColumn, ...columns],
    [columns, selectionColumn]
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [bulkDeleting, setBulkDeleting] = React.useState(false);

  const table = useReactTable({
    data,
    columns: columnsWithSelect,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getRowId: getRowId
      ? (row, index) => getRowId(row)
      : (row, index) => String(index),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedIds = selectedRows
    .map((row) => {
      const original = row.original as TData;
      return getRowId ? getRowId(original) : (original as { id?: string }).id;
    })
    .filter((id): id is string => typeof id === "string" && id.length > 0);
  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedIds.length === 0) return;
    try {
      setBulkDeleting(true);
      await onBulkDelete(selectedIds);
      table.resetRowSelection();
      toast.success("Bulk delete berhasil");
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "Bulk delete gagal";
      toast.error(message);
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        {filterKey ? (
          <Input
            className="max-w-sm"
            onChange={(event) =>
              table
                .getColumn(String(filterKey))
                ?.setFilterValue(event.target.value)
            }
            placeholder={`Filter ${String(filterKey)}...`}
            value={
              (table
                .getColumn(String(filterKey))
                ?.getFilterValue() as string) ?? ""
            }
          />
        ) : null}
        {onBulkDelete && selectedIds.length > 0 ? (
          <Button
            className="text-red-500"
            type="button"
            variant="outline"
            disabled={bulkDeleting}
            onClick={handleBulkDelete}
          >
            {bulkDeleting ? "Deleting..." : `Delete (${selectedIds.length})`}
          </Button>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto" variant="outline">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    checked={column.getIsVisible()}
                    className="capitalize"
                    key={column.id}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="bg-accent">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columnsWithSelect.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            size="sm"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            size="sm"
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
