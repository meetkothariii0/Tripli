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