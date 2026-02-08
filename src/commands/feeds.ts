import { getUserById } from "../lib/db/queries/users";
import { createFeed, getAllFeeds } from "../lib/db/queries/feeds";
import { User } from "../lib/db/schema";
import { createFeedFollow } from "src/lib/db/queries/feed_follows";
import { printFeedFollow } from "./feed_follows";
import { printFeed } from "src/lib/feeds";

export async function handlerAddFeed(
    cmdName: string,
    user: User,
    ...args: string[]
) {
    if (args.length !== 2) {
        throw new Error(`Usage: npm run ${cmdName} <name> <url>`);
    }
    const [name, url] = args;

    const newFeed = await createFeed(name, url, user.id);
    console.log("Feed created:");
    printFeed(newFeed, user);

    const feedFollow = await createFeedFollow(user.id, newFeed.id);
    printFeedFollow(feedFollow.userName, feedFollow.feedName);
}

export async function handlerFeeds(_: string) {
    const feeds = await getAllFeeds();

    for (const feed of feeds) {
        const user = await getUserById(feed.userId);
        printFeed(feed, user);
    }
}
