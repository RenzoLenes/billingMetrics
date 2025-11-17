'use client';

import { useEffect, useState } from 'react';
import { DatePickerWithRange } from '@/components/date-range-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BillingChart } from '@/components/billing-chart';
import { BillingTotalsTable } from '@/components/billing-table';
import { BillingData } from '@/types/billing';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFilters } from '@/contexts/filter-context';

export default function Dashboard() {
  return <DashboardContent />;
}

function DashboardContent() {
  const [billingData, setBillingData] = useState<BillingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { documentType, setDocumentType, dateRange, setDateRange } = useFilters();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verifica que se haya seleccionado un rango de fechas
      if (!(dateRange?.from) || !(dateRange?.to)) {
        throw new Error('Por favor, selecciona un rango de fechas');
      }

      // Formatea las fechas para enviarlas a la API
      const startDate = dateRange.from.toISOString().split('T')[0];
      const endDate = dateRange.to.toISOString().split('T')[0];

      // Llama a la API con el rango de fechas y el tipo de documento
      const response = await fetch(
        `/api/billing?startDate=${startDate}&endDate=${endDate}&documentType=${documentType}`
      );
      if (!response.ok) throw new Error('Error en la respuesta');
      const data = await response.json();

      setBillingData(data);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Resumen facturación
          </p>
        </div>

        {/* Filtros */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Rango de Fechas</CardTitle>
            </CardHeader>
            <CardContent>
              <DatePickerWithRange
              onDateChange={(range) => setDateRange(range ? { from: range.from || new Date(), to: range.to || new Date() } : undefined)} // Actualiza el estado local
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Tipo de Documento</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={documentType}
                onValueChange={(value) => setDocumentType(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="factura">Facturas</SelectItem>
                  <SelectItem value="boleta">Boletas</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Botón "Consultar" */}
        <div className="flex justify-end">
          <Button onClick={loadData} disabled={loading}>
            {loading ? 'Cargando...' : 'Consultar'}
          </Button>
        </div>

        {/* Gráfico y Tabla */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Ingresos</CardTitle>
              <CardDescription>
                Total facturado por entidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              {billingData.length > 0 ? (
                <BillingChart data={billingData} />
              ) : (
                <div className="text-center text-muted-foreground">
                  No hay datos para mostrar
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tabla Facturación</CardTitle>
              <CardDescription>
                Total facturación por entidad
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <BillingTotalsTable data={billingData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}