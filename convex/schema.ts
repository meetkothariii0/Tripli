import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    UserTable: defineTable({
        name: v.string(),
        imageUrl: v.string(),
        email: v.string(),
        subscription: v.optional(v.string()),
    }),
    TripDetailTable: defineTable({
        tripId: v.string(),
        tripDetail: v.any(),
        uid: v.id("UserTable"),
    }),
    HotelsTable: defineTable({
        tripId: v.string(),
        uid: v.id("UserTable"),
        hotelName: v.string(),
        location: v.string(),
        mapLink: v.string(),
        pricePerNight: v.number(),
        rating: v.optional(v.number()),
        description: v.optional(v.string()),
    }),
    ItineraryTable: defineTable({
        tripId: v.string(),
        uid: v.id("UserTable"),
        dayNumber: v.number(),
        dayTitle: v.string(),
        activities: v.array(v.string()),
        recommendedTransport: v.optional(v.string()),
        tips: v.optional(v.string()),
    }),
    CafesTable: defineTable({
        tripId: v.string(),
        uid: v.id("UserTable"),
        cafeName: v.string(),
        location: v.string(),
        mapLink: v.string(),
        cuisine: v.optional(v.string()),
        description: v.optional(v.string()),
    })
})