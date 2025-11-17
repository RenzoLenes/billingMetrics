// components/billing-chart.tsx
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useFilters } from '@/contexts/filter-context';
import { BillingData } from '@/types/billing';
import { useMemo } from 'react';



interface BillingChartProps {
  data: BillingData[];
}

export function BillingChart({ data }: BillingChartProps) {
  const { documentType, dateRange } = useFilters();

  const chartData = useMemo(() => {
    // console.log('Datos recibidos en BillingChart:', data); // Debugging
    //console.log('dateRange en BillingChart:', dateRange);

    if (!data || data.length === 0) {
      console.warn('No hay datos para mostrar');
      return [];
    }

    // Agrupar datos por entidad
    const groupedData = data.reduce((acc, item) => {
      // Aplicar filtros
      if (item.baja === false) {
        const docMatch = documentType === 'all' ||
          item.tipoComprobante.toLowerCase() === documentType;

        const itemDate = new Date(item.fechaEmision);
        const startDate = dateRange?.from ? new Date(dateRange.from) : null;
        const endDate = dateRange?.to ? new Date(dateRange.to) : null;

        if (startDate) startDate.setHours(0, 0, 0, 0);
        if (endDate) endDate.setHours(23, 59, 59, 999);

        const dateMatch = !startDate || !endDate ||
          (itemDate >= startDate && itemDate <= endDate);

        if (docMatch && dateMatch) {
          const entity = item.razonSocial || 'Sin nombre';
          acc[entity] = (acc[entity] || 0) + item.importeTotal;
        }
      }

      return acc;
    }, {} as Record<string, number>);

    // Convertir a formato de gráfico
    const result = Object.entries(groupedData).map(([name, total]) => ({
      name: name.replace('Entidad ', 'Person '),
      total: parseFloat(total.toFixed(2)),
    }));


    return result;
  }, [data, documentType, dateRange]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        No hay datos para mostrar con los filtros actuales
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            `S/${value.toLocaleString('es-PE', {
              notation: 'compact',
              maximumFractionDigits: 1,
            })}`
          }
        />
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat('es-PE', {
              style: 'currency',
              currency: 'PEN',
            }).format(value)
          }
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}