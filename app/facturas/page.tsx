'use client';

import { DataTable } from '@/components/data-table';
import { columns } from '@/components/columns';
import { DatePickerWithRange } from '@/components/date-range-picker';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { BillingData } from '@/types/billing';
import { useFilters } from '@/contexts/filter-context';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { withAuth } from '@/utils/withAuth';
import { Button } from '@/components/ui/button'; // Importar el componente Button

export default withAuth(FacturasContent);

function FacturasContent() {
  const [billingData, setBillingData] = useState<BillingData[]>([]);
  const [loading, setLoading] = useState(false); // Cambiar a false para que no se cargue automáticamente
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { documentType, setDocumentType, dateRange, setDateRange } = useFilters();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/auth/login');
      }
    };
    checkSession();
  }, [router]);

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
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Facturas</h1>
        <p className="text-muted-foreground mt-2">
          Gestión y búsqueda de documentos
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

      {/* Tabla de Facturación */}
      <div className="grid gap-6 md:grid-cols-1">
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
    </div>
  );
}