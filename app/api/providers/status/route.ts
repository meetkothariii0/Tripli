import { NextResponse } from "next/server";
import { ProviderInfo } from "@/lib/providers/types";

export async function GET() {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasPlaces = Boolean(process.env.GOOGLE_PLACES_API_KEY);
  const hasSerpApi = Boolean(process.env.SERPAPI_KEY);
  const hasFlights = Boolean(process.env.SERPAPI_KEY || process.env.DUFFEL_API_KEY || (process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET));
  const hasTrains = Boolean(process.env.RAPIDAPI_KEY);
  const hasHotels = Boolean(process.env.SERPAPI_KEY || process.env.GOOGLE_PLACES_API_KEY);
  const hasRedditOAuth = Boolean(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET);
  const hasReddit = Boolean(hasRedditOAuth || hasSerpApi);

  const providers: ProviderInfo[] = [
    {
      name: "Gemini",
      key: "gemini",
      status: hasGemini ? "connected" : "sample",
      envKey: "GEMINI_API_KEY",
      sourceBadge: hasGemini ? "Live · Gemini" : "Sample data"
    },
    {
      name: "Places",
      key: "places",
      status: hasPlaces ? "connected" : "sample",
      envKey: "GOOGLE_PLACES_API_KEY",
      sourceBadge: hasPlaces ? "Live · Google Places" : "Sample data"
    },
    {
      name: "Reddit Reviews",
      key: "reddit",
      status: hasReddit ? "connected" : "sample",
      envKey: "REDDIT_CLIENT_ID & REDDIT_CLIENT_SECRET (or SERPAPI_KEY)",
      sourceBadge: hasRedditOAuth ? "Live · Reddit OAuth" : hasSerpApi ? "Live · SerpApi (Reddit)" : "Sample data"
    },
    {
      name: "Flights",
      key: "flights",
      status: hasFlights ? "connected" : "sample",
      envKey: "SERPAPI_KEY (or DUFFEL_API_KEY / AMADEUS_CLIENT_ID)",
      sourceBadge: hasSerpApi ? "Live · SerpApi" : hasFlights ? "Live · Duffel/Amadeus" : "Sample data"
    },
    {
      name: "Trains",
      key: "trains",
      status: hasTrains ? "connected" : "sample",
      envKey: "RAPIDAPI_KEY",
      sourceBadge: hasTrains ? "Live · RapidAPI" : "Sample data"
    },
    {
      name: "Hotels",
      key: "hotels",
      status: hasHotels ? "connected" : "sample",
      envKey: "SERPAPI_KEY (or GOOGLE_PLACES_API_KEY)",
      sourceBadge: hasSerpApi ? "Live · SerpApi" : hasHotels ? "Live · Google Places" : "Sample data"
    }
  ];

  return NextResponse.json({ providers });
}
