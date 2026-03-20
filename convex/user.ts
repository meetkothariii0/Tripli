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
  handler: async (ctx: { db: { insert: (arg0: string, arg1: { name: any; imageUrl: any; email: any; subscription: any; }) => any; }; }, args: { name: any; imageUrl: any; email: any; subscription: any; }) => {
    await ctx.db.insert("UserTable", {
      name: args.name,
      imageUrl: args.imageUrl,
      email: args.email,
      subscription: args.subscription ?? null,
    });
  }
});

// Query: Get user by email
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx: { db: { query: (arg0: string) => { (): any; new(): any; filter: { (arg0: (q: any) => any): { (): any; new(): any; collect: { (): any; new(): any; }; }; new(): any; }; }; }; }, args: { email: any; }) => {
    const users = await ctx.db
      .query("UserTable")
      .filter(q => q.eq(q.field("email"), args.email))
      .collect();

    return users.length > 0 ? users[0] : null;
  }
});
