// app/api/billing/route.ts
import { NextResponse } from 'next/server';
import { fetchCombinedBillingData } from '@/services/billing-service';


export async function GET() {
  try {
    const billingData = await fetchCombinedBillingData();
    return NextResponse.json(billingData);
  } catch (error) {
    console.error('Error en API route:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos' },
      { status: 500 }
    );
  }
}