import { v } from "convex/values";
import { mutation, MutationCtx } from "./_generated/server";
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