import {
  BillingData,
  EntityWithCredentials,
  DocumentType,
  ExternalApiBillingItem,
  CurrencyType
} from '@/types/billing';
import {
  validateExternalApiResponse,
  validateBillingData,
  validateBillingFilters
} from '@/lib/validations/billing';
import { generateAuthHeaders } from '@/utils/auth-utils';

export const fetchCombinedBillingData = async (
  startDate?: string,
  endDate?: string,
  documentType: DocumentType = 'all'
): Promise<BillingData[]> => {
  // Validate input parameters
  try {
    validateBillingFilters({ startDate, endDate, documentType });
  } catch (error) {
    throw new Error(`Parámetros de filtro inválidos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
  const limit = 10;
  const maxRecordsPerEntity = 500;
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  // Define entities and get credentials directly
  const ENTITIES = [
    { id: 1, name: 'FOXATEL SAC' },
    { id: 2, name: 'OSCAR LENES' },
    { id: 3, name: 'LUZ CHUQUICAÑA' },
    { id: 4, name: 'JAVIER LENES' },
    { id: 5, name: 'FERNANDO LENES' },
    { id: 6, name: 'XAVIER LENES' }
  ];

  // Generate entities with credentials
  const entities: EntityWithCredentials[] = ENTITIES.map(entity => {
    const accessKey = process.env[`API_${entity.id}_ACCESS_KEY`];
    const secretKey = process.env[`API_${entity.id}_SECRET_KEY`];

    if (!accessKey || !secretKey) {
      console.warn(`Missing credentials for entity ${entity.name} (ID: ${entity.id})`);
      return {
        ...entity,
        hasCredentials: false,
        headers: null
      };
    }

    return {
      ...entity,
      hasCredentials: true,
      headers: generateAuthHeaders(accessKey, secretKey)
    };
  });

  const validEntities = entities.filter(entity => entity.hasCredentials);

  if (validEntities.length === 0) {
    throw new Error('No hay entidades con credenciales válidas configuradas');
  }

  const fetchData = async (
    entity: EntityWithCredentials,
    type: 'factura' | 'boleta'
  ): Promise<BillingData[]> => {
    if (!entity.headers) {
      console.warn(`No hay headers para ${entity.name}`);
      return [];
    }

    let allData: ExternalApiBillingItem[] = [];
    let offset = 0;
    let retryCount = 0;

    while (allData.length < maxRecordsPerEntity) {
      try {
        let url = `https://api2.facturaonline.pe/${type}/?limit=${limit}&offset=${offset}`;
        if (startDate && endDate) {
          url += `&startDate=${startDate}&endDate=${endDate}`;
        }

        const response = await fetch(url, {
          headers: {
            ...entity.headers,
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const rawApiData = await response.json();

        // Validate and transform the API response
        const validatedApiData = validateExternalApiResponse(rawApiData);
        allData = [...allData, ...validatedApiData];

        // Si recibimos menos datos que el límite, hemos llegado al final
        if (validatedApiData.length < limit) break;

        offset += limit;
        retryCount = 0; // Reset retry count on success

      } catch (error) {
        retryCount++;
        console.error(`Error en ${entity.name} (${type}) - Intento ${retryCount}:`, error);

        if (retryCount >= maxRetries) {
          console.error(`Max retries reached for ${entity.name} (${type})`);
          break;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
      }
    }

    return transformData(allData.slice(0, maxRecordsPerEntity), entity.name);
  };

  const allRequests = validEntities.flatMap((entity) => {
    const requests = [];
    if (documentType === 'all' || documentType === 'factura') {
      requests.push(fetchData(entity, 'factura'));
    }
    if (documentType === 'all' || documentType === 'boleta') {
      requests.push(fetchData(entity, 'boleta'));
    }
    return requests;
  });

  const results = await Promise.allSettled(allRequests);
  const successfulResults = results
    .filter((result): result is PromiseFulfilledResult<BillingData[]> => result.status === 'fulfilled')
    .map(result => result.value);

  // Log any failures
  results
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .forEach(result => console.error('Request failed:', result.reason));

  return successfulResults.flat();
};

const transformData = (apiData: ExternalApiBillingItem[], razonSocial: string): BillingData[] => {
  if (!Array.isArray(apiData)) {
    console.error('❌ Datos inválidos de la API:', apiData);
    return [];
  }

  return apiData
    .map((item: ExternalApiBillingItem) => {
      try {
        const transformedItem = {
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
          importeTotal: parseImporte(
            getField(item, ['importeTotal', 'ImporteTotal', 'importe_total'])
          ),
          tipoMoneda: normalizeCurrency(
            getField(item, ['tipoMoneda', 'Moneda', 'tipo_moneda'])
          ),
          baja: parseBoolean(getField(item, ['baja', 'Baja', 'baja_estado'])),
          razonSocial
        };

        // Validate the transformed item
        return validateBillingData(transformedItem);
      } catch (error) {
        console.warn('Error transformando item de API:', error, item);
        return null;
      }
    })
    .filter((item): item is BillingData => item !== null);
};

const getField = (obj: ExternalApiBillingItem, keys: string[]): string => {
  for (const key of keys) {
    const value = obj[key as keyof ExternalApiBillingItem];
    if (value !== undefined && value !== null) {
      return String(value);
    }
  }
  return '';
};

const getTipoComprobante = (tipo: string): string => {
  const tipoLower = tipo?.toLowerCase() || '';
  if (tipoLower.includes('factura')) return 'factura';
  if (tipoLower.includes('boleta')) return 'boleta';
  return tipo || 'desconocido';
};

const parseImporte = (importe: string): number => {
  if (!importe) return 0;
  const parsed = parseFloat(String(importe).replace(/[^\d.-]/g, ''));
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
};

const normalizeCurrency = (currency: string): CurrencyType => {
  const curr = currency?.toUpperCase() || 'PEN';
  if (['PEN', 'USD', 'EUR'].includes(curr)) {
    return curr as CurrencyType;
  }
  return 'PEN';
};

const parseBoolean = (value: string): boolean => {
  if (!value) return false;
  const str = String(value).toLowerCase();
  return str === 'true' || str === '1' || str === 'yes' || str === 'si';
};