import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { resolvePlace, orderActivitiesByNearestNeighbour } from "@/lib/providers/places";
import { generateMockStays, generateMockRestaurants, generateMockFlights, generateMockTrains } from "@/lib/providers/mockData";
import { TripPlan, DayItinerary, ActivityItem } from "@/lib/providers/types";

const API_KEY = process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || "";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODELS = [
  "google/gemini-2.5-flash",
  "openai/gpt-4o-mini",
  "meta-llama/llama-3.1-8b-instruct:free"
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData, messages, isFinal } = body;

    // Extract trip preferences
    const rawData = formData || (messages?.[0]?.content ? JSON.parse(messages[0].content) : {});
    const origin = rawData.origin || "Bengaluru";
    const destination = rawData.destination || "Goa";
    const dates = rawData.dates || "Flexible";
    const tripLength = parseInt(rawData.trip_length || "3", 10) || 3;
    const totalBudget = rawData.total_budget || "₹30,000 - ₹80,000";
    const spendingStyle = rawData.spending_style || "Mid-range";
    const travelers = rawData.travelers || "Couple";
    const travelStyle = Array.isArray(rawData.travel_style) ? rawData.travel_style.join(", ") : (rawData.travel_style || "Relaxed, Food");
    const foodPref = rawData.food_pref || "No preference";
    const transportPref = rawData.transport || "Flight";
    const pace = rawData.pace || "Balanced";
    const mustHaves = Array.isArray(rawData.must_haves) ? rawData.must_haves.join(", ") : (rawData.must_haves || "Local markets");

    const systemPrompt = `You are an expert AI travel planner for Tripli. Respond ONLY with valid JSON.
Requirements:
1. Output EXACTLY ${tripLength} days in the itinerary array. Day 1 is arrival; Day ${tripLength} is departure.
2. The trip has a TOTAL BUDGET of "${totalBudget}" AND a SPENDING STYLE of "${spendingStyle}". Balance both simultaneously (e.g. match accommodations, dining tier, and activity costs to this spending style within the total budget).
3. Origin: ${origin}, Destination: ${destination}, Pace: ${pace}, Travelers: ${travelers}, Food Preference: ${foodPref}.
4. Must haves: ${mustHaves}. Travel style: ${travelStyle}.
5. For each day, provide 3 to 5 realistic attractions/places in ${destination}.
6. For each meal (breakfast, lunch, dinner), suggest a real local restaurant name in ${destination}.

Output JSON Schema:
{
  "day_plans": [
    {
      "day": 1,
      "day_title": "string",
      "local_tip": "string",
      "recommended_transport": "string",
      "places": [
        {
          "name": "string",
          "why_this": "string",
          "estimated_cost": "string",
          "neighborhood": "string"
        }
      ],
      "meals": {
        "breakfast": "string",
        "lunch": "string",
        "dinner": "string"
      }
    }
  ]
}`;

    let parsedPlans: any = null;

    if (API_KEY) {
      for (const model of MODELS) {
        try {
          const response = await axios.post(
            API_URL,
            {
              model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Create a ${tripLength}-day itinerary for ${destination} starting from ${origin}. Budget: ${totalBudget}, Spending Style: ${spendingStyle}.` }
              ],
              max_tokens: 3500,
              response_format: { type: "json_object" }
            },
            {
              headers: { Authorization: `Bearer ${API_KEY}` },
              timeout: 15000
            }
          );

          const content = response.data.choices?.[0]?.message?.content;
          if (content) {
            try {
              parsedPlans = JSON.parse(content);
              if (parsedPlans?.day_plans || parsedPlans?.itinerary) break;
            } catch {
              const match = content.match(/\{[\s\S]*\}/);
              if (match) {
                parsedPlans = JSON.parse(match[0]);
                break;
              }
            }
          }
        } catch (err: any) {
          console.error("AI Generation attempt failed:", err?.message);
        }
      }
    }

    // Fallback if LLM failed or key missing
    if (!parsedPlans || (!parsedPlans.day_plans && !parsedPlans.itinerary)) {
      parsedPlans = {
        day_plans: Array.from({ length: tripLength }).map((_, i) => ({
          day: i + 1,
          day_title: i === 0 ? `Arrival & Exploring ${destination}` : i === tripLength - 1 ? `Farewell ${destination}` : `Highlights & Culture in ${destination}`,
          local_tip: "Start early to avoid tourist rush and stay hydrated.",
          recommended_transport: "Local Cab / Scooter Rental",
          places: [
            { name: `${destination} Beach Promenade`, why_this: "Iconic scenery and vibrant atmosphere", estimated_cost: "Free", neighborhood: "Coastal Area" },
            { name: `${destination} Heritage Fort & Museum`, why_this: "Fascinating historical viewpoint", estimated_cost: "₹300", neighborhood: "Old Quarter" },
            { name: `${destination} Sunset Point`, why_this: "Breathtaking panoramic sunset view", estimated_cost: "Free", neighborhood: "Hilltop / Cliff" }
          ],
          meals: {
            breakfast: `Cafe Sol ${destination}`,
            lunch: `Fisherman's Wharf ${destination}`,
            dinner: `The Saffron Table ${destination}`
          }
        }))
      };
    }

    const rawDays = parsedPlans.day_plans || parsedPlans.itinerary || [];
    // Ensure exact trip length matching
    const targetDays: any[] = [];
    for (let i = 0; i < tripLength; i++) {
      if (rawDays[i]) {
        targetDays.push(rawDays[i]);
      } else {
        targetDays.push({
          day: i + 1,
          day_title: `Exploring ${destination} Day ${i + 1}`,
          local_tip: "Check local timings before visiting.",
          recommended_transport: "Cab / Auto",
          places: [
            { name: `${destination} Central Market`, why_this: "Local spices, handicrafts, and treats", estimated_cost: "Free", neighborhood: "Central" },
            { name: `${destination} Cultural Center`, why_this: "Art exhibitions and evening music", estimated_cost: "₹200", neighborhood: "Town" }
          ],
          meals: {
            breakfast: `Morning Roast ${destination}`,
            lunch: `Spice Kitchen ${destination}`,
            dinner: `The Harbour Grill ${destination}`
          }
        });
      }
    }

    // ACCURACY RESOLUTION VIA PlacesProvider
    const resolvedItinerary: DayItinerary[] = [];

    for (let dayIdx = 0; dayIdx < targetDays.length; dayIdx++) {
      const d = targetDays[dayIdx];
      const dayNum = dayIdx + 1;
      const rawPlaces = Array.isArray(d.places) ? d.places : (Array.isArray(d.activities) ? d.activities : []);

      const activityList: ActivityItem[] = [];

      for (let pIdx = 0; pIdx < rawPlaces.length; pIdx++) {
        const p = rawPlaces[pIdx];
        const placeName = p.name || p.place_name || `Attraction in ${destination}`;
        
        // Resolve through PlacesProvider
        const resolved = await resolvePlace(placeName, destination);

        if (resolved && resolved.cityMatch) {
          activityList.push({
            id: `act-${dayNum}-${pIdx + 1}`,
            place_name: resolved.name,
            place_address: resolved.formatted_address,
            start_time: `${9 + pIdx * 2}:30`,
            end_time: `${11 + pIdx * 2}:30`,
            duration: "2 hours",
            travel_time_from_prev: pIdx === 0 ? "0 mins" : "20 mins",
            estimated_cost: p.estimated_cost || "₹250",
            neighborhood: p.neighborhood || destination,
            google_maps_link: resolved.google_maps_link,
            why_this: p.why_this || "Recommended highlight of the destination.",
            rating: resolved.rating,
            review_count: resolved.user_ratings_total,
            photo_url: resolved.photos?.[0],
            place_id: resolved.place_id,
            lat: resolved.lat,
            lng: resolved.lng,
            sourceBadge: resolved.sourceBadge,
            isLive: resolved.isLive
          });
        }
      }

      // If all places were dropped due to mismatch, fallback to a verified place in destination
      if (activityList.length === 0) {
        const fallback = await resolvePlace(`${destination} Main Landmark`, destination);
        activityList.push({
          id: `act-${dayNum}-1`,
          place_name: fallback?.name || `${destination} Landmark`,
          place_address: fallback?.formatted_address || `${destination}`,
          start_time: "10:00",
          end_time: "12:30",
          duration: "2.5 hours",
          travel_time_from_prev: "0 mins",
          estimated_cost: "Free",
          neighborhood: destination,
          google_maps_link: fallback?.google_maps_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`,
          why_this: "Prime sightseeing point in the destination.",
          rating: fallback?.rating,
          review_count: fallback?.user_ratings_total,
          photo_url: fallback?.photos?.[0],
          place_id: fallback?.place_id,
          lat: fallback?.lat,
          lng: fallback?.lng,
          sourceBadge: fallback?.sourceBadge || "Sample data",
          isLive: fallback?.isLive || false
        });
      }

      // Order stops by nearest neighbour to eliminate zig-zagging
      const orderedActivities = orderActivitiesByNearestNeighbour(activityList);

      // Resolve Meals
      const rawMeals = d.meals || {};
      const bfName = typeof rawMeals.breakfast === "string" ? rawMeals.breakfast : rawMeals.breakfast?.name || `Cafe ${destination}`;
      const lunchName = typeof rawMeals.lunch === "string" ? rawMeals.lunch : rawMeals.lunch?.name || `Bistro ${destination}`;
      const dinnerName = typeof rawMeals.dinner === "string" ? rawMeals.dinner : rawMeals.dinner?.name || `Grand Diner ${destination}`;

      const [resBf, resLunch, resDinner] = await Promise.all([
        resolvePlace(bfName, destination),
        resolvePlace(lunchName, destination),
        resolvePlace(dinnerName, destination)
      ]);

      resolvedItinerary.push({
        day: dayNum,
        day_title: d.day_title || `Day ${dayNum} in ${destination}`,
        activities: orderedActivities,
        meals: {
          breakfast: {
            name: resBf?.name || bfName,
            address: resBf?.formatted_address || `${destination} Center`,
            rating: resBf?.rating,
            photo_url: resBf?.photos?.[0],
            google_maps_link: resBf?.google_maps_link,
            place_id: resBf?.place_id,
            sourceBadge: resBf?.sourceBadge || "Sample data",
            isLive: resBf?.isLive || false
          },
          lunch: {
            name: resLunch?.name || lunchName,
            address: resLunch?.formatted_address || `${destination} Central Area`,
            rating: resLunch?.rating,
            photo_url: resLunch?.photos?.[0],
            google_maps_link: resLunch?.google_maps_link,
            place_id: resLunch?.place_id,
            sourceBadge: resLunch?.sourceBadge || "Sample data",
            isLive: resLunch?.isLive || false
          },
          dinner: {
            name: resDinner?.name || dinnerName,
            address: resDinner?.formatted_address || `${destination} Dining District`,
            rating: resDinner?.rating,
            photo_url: resDinner?.photos?.[0],
            google_maps_link: resDinner?.google_maps_link,
            place_id: resDinner?.place_id,
            sourceBadge: resDinner?.sourceBadge || "Sample data",
            isLive: resDinner?.isLive || false
          }
        },
        local_tip: d.local_tip || "Carry comfortable walking shoes and cash for small vendors.",
        recommended_transport: d.recommended_transport || "Walking & Cabs"
      });
    }

    const tripId = uuidv4();
    const finalTrip: TripPlan = {
      id: tripId,
      origin,
      destination,
      duration: `${tripLength} Days`,
      durationDays: tripLength,
      dates,
      budget: totalBudget,
      spending_style: spendingStyle,
      group_size: travelers,
      trip_type: Array.isArray(rawData.travel_style) ? rawData.travel_style[0] : (rawData.travel_style || "Leisure"),
      travel_style: Array.isArray(rawData.travel_style) ? rawData.travel_style : [rawData.travel_style || "Leisure"],
      interests: mustHaves,
      stay_type: Array.isArray(rawData.stay_type) ? rawData.stay_type : [rawData.stay_type || "3-4★ hotel"],
      food_pref: foodPref,
      pace,
      must_haves: Array.isArray(rawData.must_haves) ? rawData.must_haves : [rawData.must_haves || "Beaches"],
      itinerary: resolvedItinerary,
      stays: generateMockStays(destination),
      restaurants: generateMockRestaurants(destination),
      flights: generateMockFlights(origin, destination, dates),
      trains: generateMockTrains(origin, destination, dates),
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      trip: finalTrip,
      tripId
    });
  } catch (error: any) {
    console.error("Trip generation handler error:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary", details: error?.message },
      { status: 500 }
    );
  }
}
