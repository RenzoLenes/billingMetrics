import { z } from 'zod';

// Schema for document types
export const documentTypeSchema = z.enum(['all', 'factura', 'boleta']);

// Schema for currency types
export const currencyTypeSchema = z.enum(['PEN', 'USD', 'EUR']);

// Schema for billing filters
export const billingFiltersSchema = z.object({
  startDate: z.string().optional().refine(
    (date) => !date || !isNaN(Date.parse(date)),
    { message: 'Fecha de inicio debe ser una fecha válida' }
  ),
  endDate: z.string().optional().refine(
    (date) => !date || !isNaN(Date.parse(date)),
    { message: 'Fecha de fin debe ser una fecha válida' }
  ),
  documentType: documentTypeSchema.default('all'),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'La fecha de inicio debe ser anterior a la fecha de fin',
    path: ['dateRange']
  }
);

// Schema for external API billing item (raw response)
export const externalApiBillingItemSchema = z.object({
  fechaEmision: z.string().optional(),
  FechaEmision: z.string().optional(),
  fecha_emision: z.string().optional(),
  fechaEmitido: z.string().optional(),
  FechaEmitido: z.string().optional(),
  fecha_emitido: z.string().optional(),
  tipoComprobante: z.string().optional(),
  TipoComprobante: z.string().optional(),
  tipo_comprobante: z.string().optional(),
  tipoComprobantePolite: z.string().optional(),
  NombreTipoComprobante: z.string().optional(),
  tipo_comprobante_polite: z.string().optional(),
  importeTotal: z.union([z.string(), z.number()]).optional(),
  ImporteTotal: z.union([z.string(), z.number()]).optional(),
  importe_total: z.union([z.string(), z.number()]).optional(),
  tipoMoneda: z.string().optional(),
  Moneda: z.string().optional(),
  tipo_moneda: z.string().optional(),
  baja: z.union([z.string(), z.number(), z.boolean()]).optional(),
  Baja: z.union([z.string(), z.number(), z.boolean()]).optional(),
  baja_estado: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

// Schema for processed billing data
export const billingDataSchema = z.object({
  fechaEmision: z.string().optional().default(''),
  fechaEmitido: z.string().optional().default(''),
  tipoComprobante: z.string().min(1, 'Tipo de comprobante es requerido'),
  tipoComprobantePolite: z.string().optional().default(''),
  importeTotal: z.number().min(0, 'Importe total debe ser mayor o igual a 0'),
  tipoMoneda: currencyTypeSchema,
  razonSocial: z.string().min(1, 'Razón social es requerida'),
  baja: z.boolean(),
});

// Schema for entity
export const entitySchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
});

// Schema for entity with credentials
export const entityWithCredentialsSchema = entitySchema.extend({
  hasCredentials: z.boolean(),
  headers: z.record(z.string()).nullable(),
});

// Schema for API response
export const billingApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(billingDataSchema).optional(),
  error: z.string().optional(),
  details: z.string().optional(),
});

// Schema for environment variables validation
export const envVarsSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Supabase URL debe ser una URL válida'),
  NEXT_PUBLIC_SUPABASE_KEY: z.string().min(1, 'Supabase key es requerida'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Helper function to validate external API array response
export const validateExternalApiResponse = (data: unknown): z.infer<typeof externalApiBillingItemSchema>[] => {
  if (!Array.isArray(data)) {
    throw new Error('La respuesta de la API externa debe ser un array');
  }

  return data.map((item, index) => {
    try {
      return externalApiBillingItemSchema.parse(item);
    } catch (error) {
      console.warn(`Item ${index} en respuesta de API no válido:`, error);
      return {};
    }
  });
};

// Helper function to validate billing filters
export const validateBillingFilters = (filters: unknown) => {
  return billingFiltersSchema.parse(filters);
};

// Helper function to validate processed billing data
export const validateBillingData = (data: unknown) => {
  return billingDataSchema.parse(data);
};