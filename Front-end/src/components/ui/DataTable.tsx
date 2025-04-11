
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchField?: keyof T;
  onSearchChange?: (value: string) => void;
  onAddClick?: () => void;
  addButtonLabel?: string;
  emptyMessage?: string;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  searchField,
  onSearchChange,
  onAddClick,
  addButtonLabel = 'Add New',
  emptyMessage = 'No records found',
}: DataTableProps<T>) => {
  return (
    <div className="space-y-4">
      {(searchField || onAddClick) && (
        <div className="flex justify-between items-center">
          {searchField && onSearchChange && (
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
          {onAddClick && (
            <Button onClick={onAddClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {addButtonLabel}
            </Button>
          )}
        </div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.header as string} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.accessor as string}`} className={column.className}>
                      {column.cell ? column.cell(row) : row[column.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
