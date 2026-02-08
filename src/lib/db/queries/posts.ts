import { getTableColumns, eq, desc } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, PostData, posts } from "../schema";

export async function createPost(postData: PostData) {
    const [result] = await db
        .insert(posts)
        .values({
            url: postData.url,
            title: postData.title,
            description: postData.description,
            publishedAt: postData.publishedAt,
            feedId: postData.feedId,
        })
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getPostsForUser(userId: string, numPosts: number) {
    const userPosts = await db
        .select({
            ...getTableColumns(posts),
            feedName: feeds.name,
        })
        .from(posts)
        .innerJoin(feedFollows, eq(feedFollows.feedId, posts.feedId))
        .innerJoin(feeds, eq(feeds.id, posts.feedId))
        .where(eq(feedFollows.userId, userId))
        .orderBy(desc(posts.publishedAt))
        .limit(numPosts);
    return userPosts;
}
