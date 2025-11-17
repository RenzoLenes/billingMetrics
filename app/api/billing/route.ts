import { NextRequest, NextResponse } from 'next/server';
import { fetchCombinedBillingData } from '@/services/billing-service';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const documentType = (searchParams.get('documentType') as 'all' | 'factura' | 'boleta' | undefined) || 'all';

    // Validate date parameters
    if (startDate && isNaN(Date.parse(startDate))) {
      return NextResponse.json(
        { error: 'Fecha de inicio inválida' },
        { status: 400 }
      );
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return NextResponse.json(
        { error: 'Fecha de fin inválida' },
        { status: 400 }
      );
    }

    // Validate documentType
    const validDocumentTypes = ['all', 'factura', 'boleta'];
    if (!validDocumentTypes.includes(documentType)) {
      return NextResponse.json(
        { error: 'Tipo de documento inválido' },
        { status: 400 }
      );
    }

    const billingData = await fetchCombinedBillingData(startDate, endDate, documentType);

    return NextResponse.json(billingData, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error en API route:', error);

    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

    return NextResponse.json(
      {
        error: 'Error al obtener datos de facturación',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}