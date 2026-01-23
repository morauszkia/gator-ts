import { eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds } from "../schema";

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
