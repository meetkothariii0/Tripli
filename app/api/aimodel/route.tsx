import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const PIXABAY_API_KEY = "55105831-5a57a89787f679e2bd7bdbb58"; // Your Pixabay API key
const PIXABAY_API_URL = "https://pixabay.com/api/";

if (!GROQ_API_KEY) {
  console.warn("⚠️ GROQ_API_KEY environment variable is not set");
}

// Function to fetch high-quality images from Pixabay
async function getImageUrl(query: string, type: string = "place"): Promise<string> {
  try {
    // Create targeted search queries based on image type
    const searchQueries = [];
    
    if (type === "hotel") {
      searchQueries.push(query, `${query} luxury hotel`, `hotel room accommodation`, `modern bedroom interior`);
    } else if (type === "restaurant") {
      searchQueries.push(query, `${query} restaurant`, `delicious food cuisine`, `fine dining`);
    } else if (type === "activity") {
      searchQueries.push(query, `${query} landmark`, `tourist attraction`, `famous place`);
    }

    // Try each search query
    for (const searchQuery of searchQueries) {
      try {
        const response = await axios.get(PIXABAY_API_URL, {
          params: {
            key: PIXABAY_API_KEY,
            q: searchQuery,
            per_page: 20,
            image_type: 'photo',
            safesearch: true,
            order: 'popular'
          },
          timeout: 5000
        });

        if (response.data?.hits && response.data.hits.length > 0) {
          // Pick a random image from results for variety
          const randomIndex = Math.floor(Math.random() * Math.min(response.data.hits.length, 10));
          const image = response.data.hits[randomIndex];
          
          if (image?.largeImageURL) {
            return image.largeImageURL;
          }
        }
      } catch (e) {
        console.error(`Pixabay search failed for "${searchQuery}":`, e);
      }
    }
  } catch (error) {
    console.error(`Failed to fetch ${type} image for "${query}":`, error);
  }

  // Fallback generic images with variety
  const fallbacks = [
    { hotel: 'https://cdn.pixabay.com/photo/2016/03/28/09/34/bedroom-1285156_640.jpg', restaurant: 'https://cdn.pixabay.com/photo/2016/06/24/10/47/restaurant-1476820_640.jpg', activity: 'https://cdn.pixabay.com/photo/2016/02/18/22/18/paris-1207605_640.jpg' },
    { hotel: 'https://cdn.pixabay.com/photo/2017/08/12/17/69/luxury-2633268_640.jpg', restaurant: 'https://cdn.pixabay.com/photo/2017/08/06/14/51/food-2589575_640.jpg', activity: 'https://cdn.pixabay.com/photo/2016/01/09/18/29/landmarks-1130884_640.jpg' },
    { hotel: 'https://cdn.pixabay.com/photo/2018/01/09/19/47/hotel-3071139_640.jpg', restaurant: 'https://cdn.pixabay.com/photo/2016/04/04/14/12/meal-1307604_640.jpg', activity: 'https://cdn.pixabay.com/photo/2014/07/14/16/54/architectural-391925_640.jpg' },
  ];

  const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  return randomFallback[type as keyof typeof randomFallback] || randomFallback.activity;
}

// Function to enrich data with images
async function enrichWithImages(data: any): Promise<any> {
  if (!data) return data;

  // Enrich hotels with hotel_image_url field
  if (data.hotels && Array.isArray(data.hotels)) {
    data.hotels = await Promise.all(
      data.hotels.map(async (hotel: any) => ({
        ...hotel,
        hotel_image_url: await getImageUrl(hotel.hotel_name || 'luxury hotel', 'hotel')
      }))
    );
  }

  // Enrich restaurants with image_url field
  if (data.restaurants && Array.isArray(data.restaurants)) {
    data.restaurants = await Promise.all(
      data.restaurants.map(async (restaurant: any) => ({
        ...restaurant,
        image_url: await getImageUrl(`${restaurant.name} ${restaurant.cuisine || 'restaurant'}`, 'restaurant')
      }))
    );
  }

  // Enrich cafes with image_url field
  if (data.cafes && Array.isArray(data.cafes)) {
    data.cafes = await Promise.all(
      data.cafes.map(async (cafe: any) => ({
        ...cafe,
        image_url: await getImageUrl(`${cafe.cafe_name} cafe`, 'restaurant')
      }))
    );
  }

  // Enrich itinerary activities with image_url field
  if (data.itinerary && typeof data.itinerary === 'object') {
    for (const day of Object.values(data.itinerary)) {
      if (typeof day === 'object' && day !== null && 'activities' in day) {
        const dayObj = day as any;
        if (Array.isArray(dayObj.activities)) {
          dayObj.activities = await Promise.all(
            dayObj.activities.map(async (activity: any) => ({
              ...activity,
              image_url: await getImageUrl(activity.place_name || activity.place_address || 'attraction', 'activity')
            }))
          );
        }
      }
    }
  }

  return data;
}

// ✅ Use only chat-capable Groq models
const GROQ_MODELS = [
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  "meta-llama/llama-guard-4-12b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
];

const PROMPT = `You are an AI Trip Planner Agent. You must ask the user trip questions in this EXACT order, one at a time:

1. Origin (ui: null): Ask "Where are you traveling from?". Respond ONLY with a valid JSON object.
2. Destination (ui: null): Ask "Where would you like to go?". Respond ONLY with a valid JSON object.
3. Group Size (ui: groupSize): Ask "Who will be joining you on this trip?". Respond ONLY with a valid JSON object.
4. Trip Duration (ui: tripDuration): Ask "How many days will your trip be?". Respond ONLY with a valid JSON object.
5. Budget (ui: budget): Ask "What's your budget range for this trip?". Respond ONLY with a valid JSON object.
6. Activities (ui: tripType): Ask "What type of activities do you like?" (Allow multiple options, e.g. sightseeing, adventure, food, shopping, culture, nature, relaxation). Respond ONLY with a valid JSON object.
7. When all answers are collected, generate the trip plan (ui: final). Respond ONLY with a valid JSON object.

STRICT RULES:
- Reply ONLY with a valid JSON object matching the schema below.
- NEVER repeat any previously answered question.
- NEVER skip the trip duration question.
- Never include any extra text, explanations, or placeholders.
- Wait for the user's answer before moving to the next question.

JSON Schema:
{
  "resp": "Your next question or response text here",
  "ui": "null/groupSize/tripDuration/budget/tripType/final",
  "trip_plan": {
    "origin": "string or null",
    "destination": "string or null",
    "group_size": "string or null",
    "duration": "string or null",
    "budget": "string or null",
    "interests": "string or null"
  }
}
`;

const FINAL_PROMPT = `Respond ONLY with valid JSON matching the schema below. Do not add any extra text or comments.

IMPORTANT:
- Always recommend at least 4-5 hotels, 4-5 restaurants, and 3-4 cafes.
- Provide valid Google Maps URLs and real image URLs for every recommendation.
- Cafes are casual coffee shops and cafe establishments (separate from full-service restaurants).

Output Schema:
{
  "trip_plan": {
    "origin": "string",
    "destination": "string",
    "duration": "string",
    "budget": "string",
    "group_size": "string",
    "trip_type": "string",
    "interests": "string",
    "hotels": [
      { "hotel_name": "string", "hotel_address": "string", "price_per_night": "string", "google_maps_link": "string" },
      { "hotel_name": "string", "hotel_address": "string", "price_per_night": "string", "google_maps_link": "string" }
    ],
    "restaurants": [
      { "name": "string", "cuisine": "string", "price_range": "string", "google_maps_link": "string" },
      { "name": "string", "cuisine": "string", "price_range": "string", "google_maps_link": "string" }
    ],
    "cafes": [
      { "cafe_name": "string", "location": "string", "specialty": "string", "google_maps_link": "string" },
      { "cafe_name": "string", "location": "string", "specialty": "string", "google_maps_link": "string" }
    ],
    "itinerary": {
      "day_1": {
        "day_title": "string",
        "activities": [
          {
            "place_name": "string",
            "place_address": "string",
            "place_details": "string",
            "recommended_activities": ["string"],
            "google_maps_link": "string",
            "image_url": "string"
          }
        ],
        "tips": ["string"],
        "recommended_transport": "string"
      }
    }
  }
}`;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: NextRequest) {
  try {
    if (!GROQ_API_KEY) {
      console.error("Missing GROQ_API_KEY");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { messages, isFinal } = body ?? {};

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }
    if (!messages.every((m: any) => m?.role && m?.content)) {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }

    // ✅ Track answered fields to prevent question repetition
    const answeredFields = new Set<string>();
    messages.forEach((m: any) => {
      if (m.role === "assistant" || m.role === "user") {
        const parsed = (() => {
          try {
            return JSON.parse(m.content);
          } catch {
            return {};
          }
        })();
        if (parsed?.trip_plan) {
          Object.keys(parsed.trip_plan).forEach((key) => {
            if (parsed.trip_plan[key]) answeredFields.add(key);
          });
        }
      }
    });

    // Build prompt with information about already-answered fields
    const answeredFieldsList = Array.from(answeredFields).join(", ") || "none";
    const systemPrompt = isFinal 
      ? FINAL_PROMPT 
      : PROMPT + `\n\nAlready answered fields: ${answeredFieldsList}. DO NOT ask about these fields again.`;

    const groqMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages
        .filter((m: any) => m.role === "user" || m.role === "assistant")
        .map((m: any) => ({ role: m.role, content: String(m.content) })),
    ];

    let completion: any;
    let lastError: any;

    for (const model of GROQ_MODELS) {
      try {
        const groqResponse = await axios.post(
          GROQ_API_URL,
          {
            model,
            messages: groqMessages,
            temperature: 0.7,
            response_format: { type: "json_object" },
          },
          {
            headers: {
              Authorization: `Bearer ${GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 60000,
          }
        );

        const aiContent = groqResponse?.data?.choices?.[0]?.message?.content ?? "";
        if (!aiContent) throw new Error("Empty model response");

        completion = { choices: [{ message: { content: aiContent } }] };
        break;
      } catch (err: any) {
        lastError = err?.response?.data ?? err?.message ?? err;
        console.error(`Groq error with model: ${model}`, lastError);
      }
    }

    if (!completion) {
      return NextResponse.json(
        { error: "Error from Groq models", details: lastError },
        { status: 500 }
      );
    }

    const rawContent: string = completion.choices[0].message.content;
    let parsed: any;

    try {
      parsed = JSON.parse(rawContent);
    } catch {
      const match = rawContent.match(/\{[\s\S]*\}/);
      if (!match) {
        return NextResponse.json(
          { error: "Invalid JSON response from AI", rawContent },
          { status: 500 }
        );
      }
      parsed = JSON.parse(match[0]);
    }

    // ✅ Console log AI responses for debugging
    console.log("🤖 AI Response:", JSON.stringify(parsed, null, 2));

    const safeResponse = {
      resp: typeof parsed?.resp === "string" ? parsed.resp : "",
      ui: typeof parsed?.ui === "string" ? parsed.ui : "null",
      trip_plan: {
        origin: parsed?.trip_plan?.origin ?? null,
        destination: parsed?.trip_plan?.destination ?? null,
        duration: parsed?.trip_plan?.duration ?? null,
        group_size: parsed?.trip_plan?.group_size ?? null,
        budget: parsed?.trip_plan?.budget ?? null,
        interests: parsed?.trip_plan?.interests ?? null,
        hotels: parsed?.trip_plan?.hotels ?? [],
        restaurants: parsed?.trip_plan?.restaurants ?? [],
        cafes: parsed?.trip_plan?.cafes ?? [],
        itinerary: parsed?.trip_plan?.itinerary ?? {},
      },
    };

    const allowedUI = ["null", "groupSize", "tripDuration", "budget", "tripType", "final"];
    if (!allowedUI.includes(safeResponse.ui)) safeResponse.ui = "null";

    // Enrich with images if this is the final response
    if (isFinal && safeResponse.trip_plan) {
      safeResponse.trip_plan = await enrichWithImages(safeResponse.trip_plan);
    }

    return NextResponse.json(safeResponse);
  } catch (e: any) {
    console.error("Server error:", e);
    return NextResponse.json({ error: e?.message || "Unknown server error" }, { status: 500 });
  }
}
