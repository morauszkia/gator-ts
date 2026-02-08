import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";

export async function createFeed(name: string, url: string, userId: string) {
    const [result] = await db
        .insert(feeds)
        .values({ name, url, userId })
        .returning();
    return result;
}

export async function getAllFeeds() {
    return await db.select().from(feeds);
}

export async function getFeedByUrl(url: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function markFeedFetched(feedId: string) {
    await db
        .update(feeds)
        .set({ updatedAt: new Date(), lastFetchedAt: new Date() })
        .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
    const [nextFeed] = await db
        .select()
        .from(feeds)
        .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
        .limit(1);
    return nextFeed;
}
