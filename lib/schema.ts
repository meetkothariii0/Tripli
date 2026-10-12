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
