const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const fullPath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
};

// 1. API routes for providers
write('app/api/search/flights/route.ts', `
import { NextResponse } from 'next/server';
import { generateMockFlights } from '@/lib/providers/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin') || 'DEL';
  const dest = searchParams.get('dest') || 'BOM';
  const date = searchParams.get('date') || '';
  
  return NextResponse.json({
    live: false,
    data: generateMockFlights(origin, dest, date)
  });
}
`);

write('app/api/search/trains/route.ts', `
import { NextResponse } from 'next/server';
import { generateMockTrains } from '@/lib/providers/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin') || 'DEL';
  const dest = searchParams.get('dest') || 'BOM';
  const date = searchParams.get('date') || '';
  
  return NextResponse.json({
    live: !!process.env.RAPIDAPI_KEY,
    data: generateMockTrains(origin, dest, date)
  });
}
`);

write('app/api/search/stays/route.ts', `
import { NextResponse } from 'next/server';
import { generateMockStays } from '@/lib/providers/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dest = searchParams.get('dest') || 'BOM';
  
  return NextResponse.json({
    live: !!process.env.GOOGLE_PLACES_API_KEY,
    data: generateMockStays(dest)
  });
}
`);

write('app/api/search/food/route.ts', `
import { NextResponse } from 'next/server';
import { generateMockRestaurants } from '@/lib/providers/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dest = searchParams.get('dest') || 'BOM';
  
  return NextResponse.json({
    live: false,
    data: generateMockRestaurants(dest)
  });
}
`);

// Zod Schema for the Trip Plan
write('lib/schema.ts', `
import { z } from 'zod';

export const tripSchema = z.object({
  trip_plan: z.object({
    origin: z.string(),
    destination: z.string(),
    duration: z.string(),
    budget: z.string(),
    group_size: z.string(),
    trip_type: z.string(),
    interests: z.string(),
    itinerary: z.array(
      z.object({
        day: z.number(),
        day_title: z.string(),
        activities: z.array(
          z.object({
            place_name: z.string(),
            place_address: z.string(),
            start_time: z.string(),
            end_time: z.string(),
            duration: z.string(),
            travel_time_from_prev: z.string(),
            estimated_cost: z.string(),
            neighborhood: z.string(),
            google_maps_link: z.string(),
            why_this: z.string()
          })
        ),
        meals: z.object({
          breakfast: z.object({ name: z.string(), address: z.string() }),
          lunch: z.object({ name: z.string(), address: z.string() }),
          dinner: z.object({ name: z.string(), address: z.string() })
        }),
        local_tip: z.string(),
        recommended_transport: z.string()
      })
    )
  })
});
`);

console.log('Generated base API routes and schema.');
