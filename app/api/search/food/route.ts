import { NextResponse } from 'next/server';
import { generateMockRestaurants } from '@/lib/providers/mockData';
import { resolvePlace } from '@/lib/providers/places';
import { Restaurant } from '@/lib/providers/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dest = searchParams.get('dest') || 'Goa';
  
  if (process.env.GOOGLE_PLACES_API_KEY) {
    const sampleNames = ["Spice Garden", "Fishermans Wharf", "Sea View Cafe", "Royal Dining", "Green Leaf Pure Veg"];
    const resolvedPromises = sampleNames.map(async (name, i) => {
      const resolved = await resolvePlace(name, dest);
      if (!resolved) return null;
      const types: ("breakfast" | "lunch" | "dinner" | "extra")[] = ["breakfast", "lunch", "dinner", "extra"];
      const item: Restaurant = {
        id: `food-place-${i + 1}`,
        name: resolved.name,
        type: types[i % 4],
        cuisine: "Multi-Cuisine & Local",
        priceLevel: "₹₹",
        avgCostForTwo: 900,
        currency: "INR",
        rating: resolved.rating || 4.4,
        reviewCount: resolved.user_ratings_total || 250,
        images: resolved.photos || ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80"],
        mustTryDishes: ["Chef's Special Curry", "Traditional Bread", "Local Dessert"],
        dietaryTags: ["Veg", "Non-veg"],
        openingHours: "09:00 AM - 11:00 PM",
        bestTimeToVisit: "1:00 PM / 8:00 PM",
        reservationNeeded: false,
        distanceFromRoute: "0.5 km",
        mapLink: resolved.google_maps_link,
        reviewSnippets: ["Great local flavor and warm atmosphere."],
        sourceBadge: resolved.sourceBadge,
        isLive: resolved.isLive,
        placeId: resolved.place_id,
        lat: resolved.lat,
        lng: resolved.lng
      };
      return item;
    });

    const resolvedResults = (await Promise.all(resolvedPromises)).filter((r): r is Restaurant => r !== null);
    if (resolvedResults.length > 0) {
      return NextResponse.json({
        live: true,
        data: resolvedResults
      });
    }
  }

  const mock = generateMockRestaurants(dest);
  return NextResponse.json({
    live: false,
    data: mock
  });
}
