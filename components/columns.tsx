'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { BillingData } from '@/types/billing'

export const columns: ColumnDef<BillingData>[] = [
  {
    accessorKey: 'razonSocial',
    header: 'Razón Social',
    cell: ({ getValue }) => getValue() as string,
  },
  {
    accessorKey: 'tipoComprobantePolite',
    header: 'Tipo de Comprobante',
    cell: ({ getValue }) => getValue() as string,
  },
  {
    accessorKey: 'fechaEmision',
    header: 'Fecha de Emisión',
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
  {
    accessorKey: 'importeTotal',
    header: 'Monto',
    cell: ({ getValue }) => `S/ ${getValue()}`,
  },
];
