// services/billing-service.ts
import { generateAuthHeaders } from '@/utils/auth-utils';
import { BillingData } from '@/types/billing';


export const fetchCombinedBillingData = async (): Promise<BillingData[]> => {
  // console.log('🔄 Ejecutando fetchCombinedBillingData...');

  const limit = 10;
  const totalRecordsNeeded = 450;

  const entities = [
    { id: 1, name: 'FOXATEL SAC' },
    { id: 2, name: 'OSCAR LENES' },
    { id: 3, name: 'LUZ CHUQUICAÑA' },
    { id: 4, name: 'JAVIER LENES' },
    { id: 5, name: 'FERNANDO LENES' },
    { id: 6, name: 'XAVIER LENES' }
  ];

  const fetchData = async (entity: { id: number; name: string }, type: 'factura' | 'boleta') => {
    try {
      const accessKey = process.env[`NEXT_PUBLIC_API_${entity.id}_ACCESS_KEY`];
      const secretKey = process.env[`NEXT_PUBLIC_API_${entity.id}_SECRET_KEY`];
  
      if (!accessKey || !secretKey) {
        throw new Error(`Faltan credenciales para ${entity.name}`);
      }
  
      const headers = generateAuthHeaders(accessKey, secretKey);
      let allData: any[] = [];
      let offset = 0;
  
      while (allData.length < totalRecordsNeeded) {
        const response = await fetch(
          `https://api2.facturaonline.pe/${type}/?limit=${limit}&offset=${offset}`,
          {
            headers,
            cache: 'no-store',
          }
        );
  
        if (!response.ok) {
          throw new Error(`Error ${response.status} en ${entity.name} (${type})`);
        }
  
        const apiData: any[] = await response.json();
        allData = [...allData, ...apiData];
  
        if (apiData.length < limit) break;
  
        offset += limit;
      }
  
      return transformData(allData.slice(0, totalRecordsNeeded), entity.name);
    } catch (error) {
      console.error(`Error en ${entity.name} (${type}):`, error);
      return [];
    }
  };
  
  const allRequests = entities.flatMap((entity) => [
    fetchData(entity, 'factura'),
    fetchData(entity, 'boleta'),
  ]);
  
  const results = await Promise.all(allRequests);
  return results.flat();
};



const transformData = (apiData: any[], razonSocial: string): BillingData[] => {
  if (!Array.isArray(apiData)) {
    console.error('❌ Datos inválidos de la API:', apiData);
    return [];
  }

  const transformedData = apiData.map((item: any) => ({
    fechaEmision: getField(item, ['fechaEmision', 'FechaEmision', 'fecha_emision']),
    fechaEmitido: getField(item, ['fechaEmitido', 'FechaEmitido', 'fecha_emitido']),
    tipoComprobante: getTipoComprobante(
      getField(item, ['tipoComprobante', 'TipoComprobante', 'tipo_comprobante'])
    ),
    tipoComprobantePolite: getField(item, [
      'tipoComprobantePolite', 
      'NombreTipoComprobante', 
      'tipo_comprobante_polite'
    ]),
    importeTotal: parseFloat(
      getField(item, ['importeTotal', 'ImporteTotal', 'importe_total']) || '0'
    ),
    tipoMoneda: getField(item, ['tipoMoneda', 'Moneda', 'tipo_moneda']) || 'PEN',
    baja: Boolean(Number(getField(item, ['baja', 'Baja', 'baja_estado']))), // Conversión a booleano
    razonSocial
  }));

  // console.log(`✅ Datos transformados (${razonSocial}):`, JSON.stringify(transformedData, null, 1));

  return transformedData;
};




// Helper para obtener campos con nombres alternativos
const getField = (obj: any, keys: string[]): string => {
  for (const key of keys) {
    if (obj[key] !== undefined) return obj[key];
  }
  return '';
};

const getTipoComprobante = (tipo: string): string => {
  const tipoLower = tipo?.toLowerCase() || '';
  if (tipoLower.includes('factura')) return 'factura';
  if (tipoLower.includes('boleta')) return 'boleta';
  return tipo;
};