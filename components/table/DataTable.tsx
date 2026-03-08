"use client";

import {
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "No results.",
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="data-table overflow-hidden rounded-2xl border border-dark-500">
      {/* Mobile: Card-based list */}
      <div className="block sm:hidden divide-y divide-dark-500 bg-dark-400/60">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div key={row.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-12-regular text-dark-600">#{row.index + 1}</span>
                {flexRender(row.getVisibleCells().find(c => c.column.id === "status")?.column.columnDef.cell, row.getVisibleCells().find(c => c.column.id === "status")?.getContext()!)}
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="text-16-semibold text-white">
                  {flexRender(row.getVisibleCells().find(c => c.column.id === "guestName")?.column.columnDef.cell, row.getVisibleCells().find(c => c.column.id === "guestName")?.getContext()!)}
                </div>
                <div className="text-14-regular text-dark-600">
                  {flexRender(row.getVisibleCells().find(c => c.column.id === "schedule")?.column.columnDef.cell, row.getVisibleCells().find(c => c.column.id === "schedule")?.getContext()!)}
                </div>
              </div>

              <div className="flex flex-col gap-1 border-t border-dark-500 pt-2">
                <span className="text-12-regular text-dark-700 uppercase tracking-wider">Service</span>
                <div className="text-14-medium text-white">
                  {flexRender(row.getVisibleCells().find(c => c.column.id === "serviceId")?.column.columnDef.cell, row.getVisibleCells().find(c => c.column.id === "serviceId")?.getContext()!)}
                </div>
              </div>

              {row.getVisibleCells().find(c => c.column.id === "actions") && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {flexRender(row.getVisibleCells().find(c => c.column.id === "actions")?.column.columnDef.cell, row.getVisibleCells().find(c => c.column.id === "actions")?.getContext()!)}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-dark-600">{emptyMessage}</div>
        )}
      </div>

      {/* Desktop: Standard table */}
      <div className="hidden sm:block overflow-x-auto">
        <Table className="shad-table min-w-[800px]">
          <TableHeader className="bg-dark-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="shad-table-row-header">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="shad-table-row"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-dark-600">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="table-actions border-t border-dark-500 bg-dark-200/50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="shad-gray-btn"
        >
          <Image
            src="/assets/icons/arrow.svg"
            width={24}
            height={24}
            alt="arrow"
          />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="shad-gray-btn"
        >
          <Image
            src="/assets/icons/arrow.svg"
            width={24}
            height={24}
            alt="arrow "
            className="rotate-180"
          />
        </Button>
      </div>
    </div>
  );
}
