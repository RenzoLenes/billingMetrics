'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const users = [
  { name: 'Juan Pérez', total: 1250000, color: 'chart-1' },
  { name: 'María González', total: 980000, color: 'chart-2' },
  { name: 'Carlos Rodríguez', total: 750000, color: 'chart-3' },
  { name: 'Ana Martínez', total: 1100000, color: 'chart-4' },
  { name: 'Luis Sánchez', total: 890000, color: 'chart-5' },
  { name: 'Carmen López', total: 670000, color: 'chart-1' },
  { name: 'Pedro Ramírez', total: 930000, color: 'chart-2' },
];

export function UserStats() {
  const formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {users.map((user, index) => (
        <Card key={index} className="relative overflow-hidden">
          <div
            className={`absolute inset-0 opacity-10 bg-${user.color}`}
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 85%)' }}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatter.format(user.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total facturado
            </p>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatter.format(
              users.reduce((acc, user) => acc + user.total, 0)
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Facturación total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}