// components/billing-table.tsx
'use client';

import { useFilters } from '@/contexts/filter-context';
import { BillingData } from '@/types/billing';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';

interface BillingTotalsTableProps {
  data: BillingData[];
}

export function BillingTotalsTable({ data }: BillingTotalsTableProps) {
  const { documentType, dateRange } = useFilters();



  // Filtrar y agrupar datos
  // components/billing-table.tsx
  const aggregatedData = useMemo(() => {

    if (!data || data.length === 0) {
      console.warn('No hay datos para procesar');
      return {};
    }

    const result: Record<string, { total: number; count: number }> = {};

    try {
      data.forEach((item) => {
        // Validar campos requeridos
        if (!item.tipoComprobante || !item.fechaEmision || !item.importeTotal) {
          console.warn('Item inválido:', item);
          return;
        }

        if (item.baja === false) {
          // Filtrar por tipo de documento
          const docMatch = documentType === 'all' || item.tipoComprobante.toLowerCase() === documentType;

          // Filtrar por rango de fechas
          const itemDate = new Date(item.fechaEmision);
          const startDate = dateRange?.from ? new Date(dateRange.from) : null;
          const endDate = dateRange?.to ? new Date(dateRange.to) : null;

          if (startDate) startDate.setHours(0, 0, 0, 0);
          if (endDate) endDate.setHours(23, 59, 59, 999);

          const dateMatch = !startDate || !endDate || (itemDate >= startDate && itemDate <= endDate);

          if (docMatch && dateMatch) {
            const entity = item.razonSocial || 'Sin nombre';
            if (!result[entity]) {
              result[entity] = { total: 0, count: 0 };
            }
            result[entity].total += item.importeTotal;
            result[entity].count += 1;
          }
        }

      });
    } catch (error) {
      console.error('Error procesando datos:', error);
    }

    return result;
  }, [data, documentType, dateRange]);

  // Convertir a array para la tabla
  const aggregatedArray = useMemo(() => {
    return Object.entries(aggregatedData).map(([entity, { total, count }]) => ({
      entity,
      total,
      count,
    }));
  }, [aggregatedData]);


  const totalAmount = useMemo(() => {
    return aggregatedArray.reduce((sum, item) => sum + item.total, 0);
  }, [aggregatedArray]);

  const totalInvoices = useMemo(() => {
    return aggregatedArray.reduce((sum, item) => sum + item.count, 0);
  }, [aggregatedArray]);

  const totalEntities = useMemo(() => {
    return aggregatedArray.length;
  }, [aggregatedArray]);

  const averageAmount = useMemo(() => {
    return totalEntities > 0 ? totalAmount / totalEntities : 0;
  }, [totalAmount, totalEntities]);

  // Definir columnas para la tabla
  const columns = [
    {
      header: 'Entidad',
      accessorKey: 'entity',
    },
    {
      header: 'Total Facturado',
      accessorKey: 'total',
      cell: ({ getValue }: { getValue: () => number }) =>
        `S/${Number(getValue()).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
    },
    {
      header: 'Cantidad de Documentos',
      accessorKey: 'count',
    },
  ];

  const table = useReactTable({
    data: aggregatedArray,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">Total Facturado</div>
          <div className="text-xl font-bold">
            {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(totalAmount)}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">Total Facturas</div>
          <div className="text-xl font-bold">{totalInvoices}</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">Promedio por Entidad</div>
          <div className="text-xl font-bold">
            {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(averageAmount)}
          </div>
        </div>
      </div>
    </div>
  );
}