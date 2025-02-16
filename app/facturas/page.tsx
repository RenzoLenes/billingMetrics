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
import { useState } from 'react';

export default function FacturasPage() {
  const [searchTerm, setSearchTerm] = useState('');

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
              <Select defaultValue="all">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="boleta">Boletas</SelectItem>
                  <SelectItem value="factura">Facturas</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium">Buscar por Nombre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
          <CardDescription>
            Lista completa de facturas y boletas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}