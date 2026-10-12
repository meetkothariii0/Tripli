import { NextResponse } from 'next/server';
import { generateMockTrains } from '@/lib/providers/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin') || 'DEL';
  const dest = searchParams.get('dest') || 'BOM';
  const date = searchParams.get('date') || '';
  
  const trains = generateMockTrains(origin, dest, date);

  return NextResponse.json({
    live: false,
    data: trains
  });
}
