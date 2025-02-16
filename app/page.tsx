// app/page.tsx
'use client';

import { FilterProvider } from '@/contexts/filter-context';
import { DatePickerWithRange } from '@/components/date-range-picker';
import { DataTable } from '@/components/data-table';
import { columns } from '@/components/columns';
import { BillingChart } from '@/components/billing-chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useFilters } from '@/contexts/filter-context';
import { BillingData } from '@/types/billing';
import { BillingTotalsTable } from '@/components/billing-table';

export default function Home() {
  return (
    <FilterProvider>
      <HomeContent />
    </FilterProvider>
  );
}

// app/page.tsx
function HomeContent() {
  const [billingData, setBillingData] = useState<BillingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { documentType, setDocumentType, dateRange, setDateRange } = useFilters();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/billing');
        if (!response.ok) throw new Error('Error en la respuesta');
        const data = await response.json();

        setBillingData(data);
      } catch (err) {
        console.error('Error cargando datos:', err); // Debugging
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-8">
        {/* Filtros */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Rango de Fechas</CardTitle>
            </CardHeader>
            <CardContent>
              <DatePickerWithRange />
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
              <CardTitle>Tabla de Facturación</CardTitle>
              <CardDescription>
                Resumen detallado de todas las transacciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={billingData}
                loading={loading}
                error={error}
              />
            </CardContent>
          </Card>












        </div>

        <div className='grid gap-6'>



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