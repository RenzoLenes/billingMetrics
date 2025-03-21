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


export default withAuth(FacturasContent);


function FacturasContent() {
  const [billingData, setBillingData] = useState<BillingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const router = useRouter()
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
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Facturas</h1>
        <p className="text-muted-foreground mt-2">
          Gestión y búsqueda de documentos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* <div className="grid gap-6 md:grid-cols-3"> */}
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