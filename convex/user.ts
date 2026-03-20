import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Mutation: Create new user
export const CreateNewUser = mutation({
  args: {
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
    subscription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("UserTable", {
      name: args.name,
      imageUrl: args.imageUrl,
      email: args.email,
      subscription: args.subscription,
    });
  }
});

// Query: Get user by email
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("UserTable")
      .filter(q => q.eq(q.field("email"), args.email))
      .collect();

    return users.length > 0 ? users[0] : null;
  }
});
