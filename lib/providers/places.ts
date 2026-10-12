import axios from "axios";
import { ResolvedPlace, ActivityItem, MealItem, DayItinerary } from "./types";

interface GoogleTextSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
  }>;
}

const placesCache = new Map<string, ResolvedPlace | null>();

export async function resolvePlace(name: string, city: string): Promise<ResolvedPlace | null> {
  const query = `${name} ${city}`.trim();
  const cacheKey = query.toLowerCase();
  if (placesCache.has(cacheKey)) {
    return placesCache.get(cacheKey) || null;
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    // Generate deterministic sample coordinates & data
    const mockHash = Math.abs(
      query.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    );
    const mockLat = 15.2 + (mockHash % 100) * 0.005;
    const mockLng = 73.7 + ((mockHash * 3) % 100) * 0.005;

    const mockResolved: ResolvedPlace = {
      place_id: `sample_place_${mockHash}`,
      name,
      formatted_address: `${name}, Near City Center, ${city}`,
      rating: Number((4.1 + (mockHash % 9) * 0.1).toFixed(1)),
      user_ratings_total: 100 + (mockHash % 500),
      photos: [
        `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80`
      ],
      lat: mockLat,
      lng: mockLng,
      cityMatch: true,
      google_maps_link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${name} ${city}`
      )}&query_place_id=sample_place_${mockHash}`,
      sourceBadge: "Sample data",
      isLive: false
    };
    placesCache.set(cacheKey, mockResolved);
    return mockResolved;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&key=${apiKey}`;

    const res = await axios.get(url, { timeout: 6000 });
    const results: GoogleTextSearchResult[] = res.data?.results || [];

    if (!results.length) {
      placesCache.set(cacheKey, null);
      return null;
    }

    const first = results[0];
    const formattedAddress = first.formatted_address || "";

    // City match verification (case-insensitive)
    const normalizedCity = city.toLowerCase().trim();
    const cityMatch =
      formattedAddress.toLowerCase().includes(normalizedCity) ||
      first.name.toLowerCase().includes(normalizedCity);

    if (!cityMatch) {
      // Drop if city does not match destination
      placesCache.set(cacheKey, null);
      return null;
    }

    const lat = first.geometry?.location.lat ?? 0;
    const lng = first.geometry?.location.lng ?? 0;
    const photoRef = first.photos?.[0]?.photo_reference;
    const photoUrl = photoRef
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${apiKey}`
      : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80";

    const resolved: ResolvedPlace = {
      place_id: first.place_id,
      name: first.name,
      formatted_address: formattedAddress,
      rating: first.rating,
      user_ratings_total: first.user_ratings_total,
      photos: [photoUrl],
      lat,
      lng,
      cityMatch: true,
      google_maps_link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${first.name} ${city}`
      )}&query_place_id=${first.place_id}`,
      sourceBadge: "Live · Google Places",
      isLive: true
    };

    placesCache.set(cacheKey, resolved);
    return resolved;
  } catch (err) {
    console.error("Google Places Text Search error:", err);
    placesCache.set(cacheKey, null);
    return null;
  }
}

// Distance calculation between coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = lat1 - lat2;
  const dLng = lng1 - lng2;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

// Nearest-neighbour order to prevent zig-zagging
export function orderActivitiesByNearestNeighbour(activities: ActivityItem[]): ActivityItem[] {
  if (activities.length <= 2) return activities;

  const validStops = [...activities];
  const ordered: ActivityItem[] = [];

  // Pick first item as starting point
  let current = validStops.shift()!;
  ordered.push(current);

  while (validStops.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < validStops.length; i++) {
      const candidate = validStops[i];
      const dist = calculateDistance(
        current.lat ?? 0,
        current.lng ?? 0,
        candidate.lat ?? 0,
        candidate.lng ?? 0
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    current = validStops.splice(nearestIndex, 1)[0];
    ordered.push(current);
  }

  // Adjust time slots sequentially
  const baseStartHours = [9, 11, 14, 16, 18, 20];
  return ordered.map((item, idx) => {
    const startH = baseStartHours[idx % baseStartHours.length];
    const endH = startH + 2;
    return {
      ...item,
      start_time: `${startH}:00`,
      end_time: `${endH}:00`,
      travel_time_from_prev: idx === 0 ? "0 mins" : "15-20 mins"
    };
  });
}
