import { NextResponse } from 'next/server';
import { fetchSerpApiHotels } from '@/lib/providers/serpapi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dest = searchParams.get('dest') || 'Goa';
  const checkIn = searchParams.get('checkIn') || undefined;
  const checkOut = searchParams.get('checkOut') || undefined;
  
  const stays = await fetchSerpApiHotels(dest, checkIn, checkOut);
  const isLive = stays.length > 0 && stays[0].isLive;

  return NextResponse.json({
    live: isLive,
    data: stays
  });
}
