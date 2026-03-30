import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const CreateTripDetail = mutation({
  args: {
    tripId: v.string(),
    uid: v.id("UserTable"),
    tripDetail: v.any()
  },
  handler: async (ctx: MutationCtx, args: { tripId: string; uid: Doc<"UserTable">["_id"]; tripDetail: any }) => {
    const result = await ctx.db.insert("TripDetailTable", {
      tripDetail: args.tripDetail,
      uid: args.uid,
      tripId: args.tripId
    });
    return result;
  }
});

export const getUserTrips = query({
  args: {
    uid: v.id("UserTable")
  },
  handler: async (ctx: QueryCtx, args: { uid: Doc<"UserTable">["_id"] }) => {
    const trips = await ctx.db
      .query("TripDetailTable")
      .filter(q => q.eq(q.field("uid"), args.uid))
      .collect();
    
    return trips.sort((a, b) => {
      const aTime = a._creationTime || 0;
      const bTime = b._creationTime || 0;
      return bTime - aTime; // Sort by most recent first
    });
  }
});

export const CreateHotels = mutation({
  args: {
    tripId: v.string(),
    uid: v.id("UserTable"),
    hotels: v.array(v.object({
      hotelName: v.string(),
      location: v.string(),
      mapLink: v.string(),
      pricePerNight: v.number(),
      rating: v.optional(v.number()),
      description: v.optional(v.string()),
    }))
  },
  handler: async (ctx: MutationCtx, args: any) => {
    const results = [];
    for (const hotel of args.hotels) {
      const result = await ctx.db.insert("HotelsTable", {
        tripId: args.tripId,
        uid: args.uid,
        hotelName: hotel.hotelName,
        location: hotel.location,
        mapLink: hotel.mapLink,
        pricePerNight: hotel.pricePerNight,
        rating: hotel.rating,
        description: hotel.description,
      });
      results.push(result);
    }
    return results;
  }
});

export const GetTripHotels = query({
  args: {
    tripId: v.string()
  },
  handler: async (ctx: QueryCtx, args: { tripId: string }) => {
    const hotels = await ctx.db
      .query("HotelsTable")
      .filter(q => q.eq(q.field("tripId"), args.tripId))
      .collect();
    return hotels;
  }
});

export const CreateItinerary = mutation({
  args: {
    tripId: v.string(),
    uid: v.id("UserTable"),
    itinerary: v.array(v.object({
      dayNumber: v.number(),
      dayTitle: v.string(),
      activities: v.array(v.string()),
      recommendedTransport: v.optional(v.string()),
      tips: v.optional(v.string()),
    }))
  },
  handler: async (ctx: MutationCtx, args: any) => {
    const results = [];
    for (const day of args.itinerary) {
      const result = await ctx.db.insert("ItineraryTable", {
        tripId: args.tripId,
        uid: args.uid,
        dayNumber: day.dayNumber,
        dayTitle: day.dayTitle,
        activities: day.activities,
        recommendedTransport: day.recommendedTransport,
        tips: day.tips,
      });
      results.push(result);
    }
    return results;
  }
});

export const GetTripItinerary = query({
  args: {
    tripId: v.string()
  },
  handler: async (ctx: QueryCtx, args: { tripId: string }) => {
    const itinerary = await ctx.db
      .query("ItineraryTable")
      .filter(q => q.eq(q.field("tripId"), args.tripId))
      .collect();
    
    // Sort by day number
    return itinerary.sort((a, b) => a.dayNumber - b.dayNumber);
  }
});

export const CreateCafes = mutation({
  args: {
    tripId: v.string(),
    uid: v.id("UserTable"),
    cafes: v.array(v.object({
      cafeName: v.string(),
      location: v.string(),
      mapLink: v.string(),
      cuisine: v.optional(v.string()),
      description: v.optional(v.string()),
    }))
  },
  handler: async (ctx: MutationCtx, args: any) => {
    const results = [];
    for (const cafe of args.cafes) {
      const result = await ctx.db.insert("CafesTable", {
        tripId: args.tripId,
        uid: args.uid,
        cafeName: cafe.cafeName,
        location: cafe.location,
        mapLink: cafe.mapLink,
        cuisine: cafe.cuisine,
        description: cafe.description,
      });
      results.push(result);
    }
    return results;
  }
});

export const GetTripCafes = query({
  args: {
    tripId: v.string()
  },
  handler: async (ctx: QueryCtx, args: { tripId: string }) => {
    const cafes = await ctx.db
      .query("CafesTable")
      .filter(q => q.eq(q.field("tripId"), args.tripId))
      .collect();
    return cafes;
  }
});