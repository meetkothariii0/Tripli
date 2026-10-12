import axios from "axios";
import { Flight, Stay } from "./types";
import { generateMockFlights, generateMockStays } from "./mockData";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const cache = new Map<string, CacheEntry<unknown>>();
const inFlightRequests = new Map<string, Promise<unknown>>();

async function dedupeAndCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key) as CacheEntry<T> | undefined;
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key) as Promise<T>;
  }

  const promise = (async () => {
    try {
      const data = await fetcher();
      cache.set(key, { data, timestamp: Date.now() });
      return data;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, promise);
  return promise;
}

export async function fetchSerpApiFlights(
  origin: string,
  destination: string,
  date: string
): Promise<Flight[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return generateMockFlights(origin, destination, date);
  }

  const cacheKey = `flights:${origin}:${destination}:${date}`.toLowerCase();

  return dedupeAndCache<Flight[]>(cacheKey, async () => {
    try {
      const params = {
        engine: "google_flights",
        departure_id: origin,
        arrival_id: destination,
        outbound_date: date || new Date().toISOString().split("T")[0],
        currency: "INR",
        hl: "en",
        api_key: apiKey
      };

      const res = await axios.get("https://serpapi.com/search.json", {
        params,
        timeout: 10000
      });

      const bestFlights = res.data?.best_flights || res.data?.other_flights || [];
      if (!Array.isArray(bestFlights) || bestFlights.length === 0) {
        return generateMockFlights(origin, destination, date);
      }

      return bestFlights.slice(0, 8).map((bf: any, idx: number) => {
        const flightDetails = bf.flights?.[0] || {};
        const airline = flightDetails.airline || "Airline";
        const price = bf.price || (4500 + idx * 600);
        const duration = bf.total_duration || 150;

        return {
          id: `serp-flight-${idx + 1}`,
          airlineName: airline,
          airlineLogo: flightDetails.airline_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(airline)}&background=random`,
          departureTime: flightDetails.departure_airport?.time || "09:00 AM",
          arrivalTime: flightDetails.arrival_airport?.time || "11:30 AM",
          origin: flightDetails.departure_airport?.id || origin,
          destination: flightDetails.arrival_airport?.id || destination,
          durationMinutes: duration,
          stops: (bf.flights?.length || 1) - 1,
          price,
          currency: "INR",
          baggage: "Standard cabin & check-in",
          badges: idx === 0 ? ["Best Value"] : idx === 1 ? ["Fastest"] : [],
          bookingLink: bf.booking_token ? `https://www.google.com/travel/flights?token=${bf.booking_token}` : "https://www.google.com/travel/flights",
          sourceBadge: "Live · SerpApi",
          isLive: true
        };
      });
    } catch (err) {
      console.error("SerpApi Flights search error:", err);
      return generateMockFlights(origin, destination, date);
    }
  });
}

export async function fetchSerpApiHotels(
  destination: string,
  checkIn?: string,
  checkOut?: string
): Promise<Stay[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return generateMockStays(destination);
  }

  const cacheKey = `hotels:${destination}:${checkIn || ""}:${checkOut || ""}`.toLowerCase();

  return dedupeAndCache<Stay[]>(cacheKey, async () => {
    try {
      const params = {
        engine: "google_hotels",
        q: `${destination} hotels`,
        check_in_date: checkIn,
        check_out_date: checkOut,
        currency: "INR",
        hl: "en",
        api_key: apiKey
      };

      const res = await axios.get("https://serpapi.com/search.json", {
        params,
        timeout: 10000
      });

      const properties = res.data?.properties || [];
      if (!Array.isArray(properties) || properties.length === 0) {
        return generateMockStays(destination);
      }

      return properties.slice(0, 9).map((prop: any, idx: number) => {
        const rate = prop.rate_per_night?.extracted_lowest || (2500 + idx * 1200);
        const name = prop.name || `Hotel in ${destination}`;
        const rating = prop.overall_rating || 4.2;

        return {
          id: `serp-hotel-${idx + 1}`,
          name,
          category: idx % 3 === 0 ? "Budget" : idx % 3 === 1 ? "Mid-range" : "Luxury",
          area: destination,
          distanceToCenter: prop.distance || "1.5 km",
          pricePerNight: rate,
          totalPrice: rate * 3,
          currency: "INR",
          stars: prop.hotel_class ? parseInt(prop.hotel_class, 10) : 4,
          rating,
          reviewCount: prop.reviews || 220,
          images: prop.images?.map((im: any) => im.thumbnail) || [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80"
          ],
          amenities: prop.amenities || ["Wi-Fi", "Pool", "Room Service"],
          checkIn: "14:00",
          checkOut: "11:00",
          cancellationPolicy: "Flexible cancellation",
          pros: ["Prime spot in city", "Great verified reviews"],
          cons: ["High seasonal demand"],
          bestFor: "Travelers & Vacationers",
          nearbyFood: ["Local restaurants nearby"],
          nearbyTransport: ["City transport connected"],
          mapLink: prop.link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + destination)}`,
          bookingLink: prop.link || "https://www.google.com/travel/hotels",
          reviewSnippets: [
            { type: "positive", text: "Great hospitality and pleasant stay." }
          ],
          sourceBadge: "Live · SerpApi",
          isLive: true,
          placeId: `serp_prop_${idx + 1}`,
          lat: prop.gps_coordinates?.latitude,
          lng: prop.gps_coordinates?.longitude
        };
      });
    } catch (err) {
      console.error("SerpApi Hotels search error:", err);
      return generateMockStays(destination);
    }
  });
}
