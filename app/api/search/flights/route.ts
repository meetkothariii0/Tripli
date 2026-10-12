import { NextResponse } from 'next/server';
import { fetchSerpApiFlights } from '@/lib/providers/serpapi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin') || 'DEL';
  const dest = searchParams.get('dest') || 'BOM';
  const date = searchParams.get('date') || '';
  
  const flights = await fetchSerpApiFlights(origin, dest, date);
  const isLive = flights.length > 0 && flights[0].isLive;

  return NextResponse.json({
    live: isLive,
    data: flights
  });
}
