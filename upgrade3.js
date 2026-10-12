const fs = require('fs');
const path = require('path');

const routeContent = \`
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY || "";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODELS = [
  "google/gemini-2.5-flash",
  "openai/gpt-4o-mini",
  "meta-llama/llama-3.1-8b-instruct:free"
];

const FINAL_PROMPT = \\\`You are a strict AI trip planner. Respond ONLY with valid JSON. 
Follow these ITINERARY ACCURACY RULES strictly:
1. Output EXACTLY one day object per trip day. No more, no fewer. Day 1 accounts for arrival; the last day accounts for departure.
2. 4-6 activities per day for balanced pace (3-4 relaxed, 6-7 packed), each with start time, end time, duration, travel time from the previous stop, estimated cost, neighborhood, and a Google Maps link.
3. Cluster each day geographically so there is no zig-zagging.
4. Always include breakfast, lunch, and dinner slots, tied to a specific real restaurant matching the food preference.
5. Total cost must fit the budget.
6. Only real, well-known places. Add a 'why this' per activity and a short 'local tip' per day.

Schema:
{
  "trip_plan": {
    "origin": "string",
    "destination": "string",
    "duration": "string",
    "budget": "string",
    "group_size": "string",
    "trip_type": "string",
    "interests": "string",
    "itinerary": [
      {
        "day": 1,
        "day_title": "string",
        "activities": [
          {
             "place_name": "string", "place_address": "string", "start_time": "string",
             "end_time": "string", "duration": "string", "travel_time_from_prev": "string",
             "estimated_cost": "string", "neighborhood": "string", "google_maps_link": "string",
             "why_this": "string"
          }
        ],
        "meals": {
           "breakfast": { "name": "string", "address": "string" },
           "lunch": { "name": "string", "address": "string" },
           "dinner": { "name": "string", "address": "string" }
        },
        "local_tip": "string",
        "recommended_transport": "string"
      }
    ]
  }
}
\\\`;

export async function POST(req: NextRequest) {
  try {
    const { messages, isFinal } = await req.json();
    
    let completion;
    for (const model of MODELS) {
      try {
        const response = await axios.post(
          API_URL,
          {
            model,
            messages: [{ role: 'system', content: FINAL_PROMPT }, ...messages],
            max_tokens: 4000,
            response_format: { type: "json_object" }
          },
          { headers: { Authorization: \\\`Bearer \${API_KEY}\\\` } }
        );
        completion = response.data.choices[0].message.content;
        break;
      } catch (e) {
        console.error("Model error", e?.response?.data || e.message);
      }
    }
    
    if (!completion) return NextResponse.json({error: "Failed to generate"}, {status: 500});
    return NextResponse.json(JSON.parse(completion));
  } catch (e) {
    return NextResponse.json({error: "Server Error"}, {status: 500});
  }
}
\`;

fs.writeFileSync(path.join(__dirname, 'app/api/aimodel/route.tsx'), routeContent.trim() + '\\n', 'utf8');
console.log("Updated aimodel route.");
