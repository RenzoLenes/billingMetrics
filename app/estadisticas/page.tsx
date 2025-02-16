'use client';

import { BillingChart } from '@/components/billing-chart';
import { UserStats } from '@/components/user-stats';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FilterProvider } from '@/contexts/filter-context';
import { BillingTotalsTable } from '@/components/billing-table';

export default function EstadisticasPage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Estadísticas</h1>
        <p className="text-muted-foreground mt-2">
          Análisis detallado de la facturación
        </p>
      </div>

      <UserStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Ingresos</CardTitle>
            <CardDescription>
              Visualización gráfica de la facturación por cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
              <FilterProvider>
                <BillingChart data={[]} />
              </FilterProvider>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendencias Mensuales</CardTitle>
            <CardDescription>
              Evolución de la facturación en el tiempo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
              <FilterProvider>
                <BillingChart data={[]} />
              </FilterProvider>
          </CardContent>
        </Card>


      </div>


    </div>
  );
}