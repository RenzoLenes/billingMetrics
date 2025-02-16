// components/data-table.tsx
'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,  
  SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useMemo } from 'react';
import { useFilters } from '@/contexts/filter-context';
import { BillingData } from '@/types/billing';

interface DataTableProps {
  columns: ColumnDef<BillingData>[];
  data?: BillingData[];
  loading?: boolean;
  error?: string | null;
}

export function DataTable({
  columns,
  data = [],
  loading = false,
  error = null,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { documentType, dateRange } = useFilters();

  // Memoized filtered data
  const filteredData = useMemo(() => {
    try {
      return data.filter((item) => {
        // Filtro por tipo de documento
        const docMatch = documentType === 'all' || 
          item.tipoComprobante.toLowerCase() === documentType;
        
        // Filtro por fecha
        const itemDate = new Date(item.fechaEmision);
        const startDate = dateRange?.from ? new Date(dateRange.from) : null;
        const endDate = dateRange?.to ? new Date(dateRange.to) : null;
        
        // Ajustar horas para comparación completa
        if (startDate) startDate.setHours(0, 0, 0, 0);
        if (endDate) endDate.setHours(23, 59, 59, 999);
        
        const dateMatch = !startDate || !endDate || 
          (itemDate >= startDate && itemDate <= endDate);

        return docMatch && dateMatch;
      });
    } catch (error) {
      console.error('Error applying filters:', error);
      return [];
    }
  }, [documentType, dateRange, data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  // Mostrar estados
  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        Error cargando datos: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        Cargando datos...
      </div>
    );
  }

  return (
    <div>
      {/* Filtros activos */}
      <div className="mb-4 text-sm text-muted-foreground">
        Mostrando {filteredData.length} de {data.length} registros
        {documentType !== 'all' && ` - Tipo: ${documentType}`}
        {dateRange && ` - Fechas: ${dateRange.from?.toLocaleDateString()} a ${dateRange.to?.toLocaleDateString()}`}
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {data.length === 0 
                    ? 'No hay datos disponibles' 
                    : 'No hay resultados con los filtros actuales'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Paginación */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}