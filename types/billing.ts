// types/billing.ts

export type DocumentType = 'all' | 'factura' | 'boleta';

export type CurrencyType = 'PEN' | 'USD' | 'EUR';

export interface BillingData {
  fechaEmision: string;
  fechaEmitido: string;
  tipoComprobante: string;
  tipoComprobantePolite: string;
  importeTotal: number;
  tipoMoneda: CurrencyType;
  razonSocial: string;
  baja: boolean;
}

export interface Entity {
  id: number;
  name: string;
}

export interface EntityWithCredentials extends Entity {
  hasCredentials: boolean;
  headers: Record<string, string> | null;
}

export interface BillingFilters {
  startDate?: string;
  endDate?: string;
  documentType: DocumentType;
}

export interface BillingApiResponse {
  success: boolean;
  data?: BillingData[];
  error?: string;
  details?: string;
}

// Raw API response from external service
export interface ExternalApiBillingItem {
  fechaEmision?: string;
  FechaEmision?: string;
  fecha_emision?: string;
  fechaEmitido?: string;
  FechaEmitido?: string;
  fecha_emitido?: string;
  tipoComprobante?: string;
  TipoComprobante?: string;
  tipo_comprobante?: string;
  tipoComprobantePolite?: string;
  NombreTipoComprobante?: string;
  tipo_comprobante_polite?: string;
  importeTotal?: string | number;
  ImporteTotal?: string | number;
  importe_total?: string | number;
  tipoMoneda?: string;
  Moneda?: string;
  tipo_moneda?: string;
  baja?: string | number | boolean;
  Baja?: string | number | boolean;
  baja_estado?: string | number | boolean;
}

export interface BillingStats {
  totalAmount: number;
  totalDocuments: number;
  averageAmount: number;
  byEntity: Array<{
    razonSocial: string;
    totalAmount: number;
    documentCount: number;
    averageAmount: number;
  }>;
  byDocumentType: Array<{
    type: string;
    count: number;
    totalAmount: number;
  }>;
}