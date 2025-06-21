import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// 🚀 Create a link
export const createLink = mutation({
  args: {
    title: v.string(),
    url: v.string(),
  },
  returns: v.id("links"),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await db.insert("links", {
      userId: identity.subject,
      title: args.title,
      url: args.url,
      order: Date.now(), // use this for sorting by default order by creation time (newest first)
    });
  },
});

// 🗂️ Get all links for a user (used in dashboard)
export const getLinks = query({
  args: { userId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("links"),
      _creationTime: v.number(),
      userId: v.string(),
      title: v.string(),
      url: v.string(),
      order: v.number(),
    }),
  ),
  handler: async ({ db }, args) => {
    return await db
      .query("links")
      .withIndex("by_user_and_order", (q) => q.eq("userId", args.userId))
      .order("asc")
      .collect();
  },
});

// 🌐 Get links by user slug (username or clerk ID)
export const getLinksBySlug = query({
  args: { slug: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("links"),
      _creationTime: v.number(),
      userId: v.string(),
      title: v.string(),
      url: v.string(),
      order: v.number(),
    }),
  ),
  handler: async ({ db }, args) => {
    // First try to find a custom username
    const usernameRecord = await db
      .query("usernames")
      .withIndex("by_username", (q) => q.eq("username", args.slug))
      .unique();

    let userId: string;
    if (usernameRecord) {
      userId = usernameRecord.userId;
    } else {
      // Treat slug as potential clerk ID
      userId = args.slug;
    }

    return await db
      .query("links")
      .withIndex("by_user_and_order", (q) => q.eq("userId", userId))
      .order("asc")
      .collect();
  },
});

// 🔍 Get links by user ID
export const getLinksByUserId = query({
  args: { userId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("links"),
      _creationTime: v.number(),
      userId: v.string(),
      title: v.string(),
      url: v.string(),
      order: v.number(),
    }),
  ),
  handler: async ({ db }, args) => {
    return await db
      .query("links")
      .withIndex("by_user_and_order", (q) => q.eq("userId", args.userId))
      .order("asc")
      .collect();
  },
});

// get number of links by user id
export const getLinkCountByUserId = query({
  args: { userId: v.string() },
  returns: v.number(),
  handler: async ({ db }, args) => {
    const links = await db
      .query("links")
      .withIndex("by_user_and_order", (q) => q.eq("userId", args.userId))
      .collect();
    return links.length;
  },
});

// ❌ Delete link
export const deleteLink = mutation({
  args: { linkId: v.id("links") },
  returns: v.null(),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const link = await db.get(args.linkId);
    if (!link || link.userId !== identity.subject)
      throw new Error("Unauthorized");

    await db.delete(args.linkId);
    return null;
  },
});

// ✏️ Update link
export const updateLink = mutation({
  args: {
    linkId: v.id("links"),
    title: v.string(),
    url: v.string(),
  },
  returns: v.null(),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const link = await db.get(args.linkId);
    if (!link || link.userId !== identity.subject)
      throw new Error("Unauthorized");

    await db.patch(args.linkId, {
      title: args.title,
      url: args.url,
    });
    return null;
  },
});

// ✏️ Update order
export const updateLinkOrder = mutation({
  args: { linkIds: v.array(v.id("links")) },
  returns: v.null(),
  handler: async ({ db, auth }, { linkIds }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get all links and filter out invalid ones
    const links = await Promise.all(linkIds.map((linkId) => db.get(linkId)));

    const validLinks = links
      .map((link, index) => ({ link, originalIndex: index }))
      .filter(({ link }) => link && link.userId === identity.subject)
      .map(({ link, originalIndex }) => ({
        link: link as NonNullable<typeof link>,
        originalIndex,
      }));

    // Update only valid links with their new order
    await Promise.all(
      validLinks.map(({ link, originalIndex }) =>
        db.patch(link._id, { order: originalIndex }),
      ),
    );
    return null;
  },
});
