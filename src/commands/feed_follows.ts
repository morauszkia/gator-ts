import { getFeedByUrl } from "src/lib/db/queries/feeds";
import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed_follows";
import { User } from "src/lib/db/schema";

export async function printFeedFollow(userName: string, feedName: string) {
  console.log(`${userName} is now following ${feedName}`);
}

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`Usage: npm run start ${cmdName} <url>`);
  }

  const url = args[0];

  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`No feed found for url ${url}`);
  }

  const newFollow = await createFeedFollow(user.id, feed.id);
  printFeedFollow(newFollow.userName, newFollow.feedName);
}

export async function handlerFollowing(_: string, user: User) {
  const feeds = await getFeedFollowsForUser(user.id);
  if (feeds.length === 0) {
    console.log(`No feed follows found for ${user.name}.`);
    return;
  }

  console.log(`Feeds followed by ${user.name}:`);
  for (const feed of feeds) {
    console.log(`* ${feed.feedName}`);
  }
}

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`Usage: npm run start ${cmdName} <url>`);
  }
  const url = args[0];
  const feed = await getFeedByUrl(url);
  await deleteFeedFollow(user.id, feed.id);
  console.log(`${user.name} is no longer following ${feed.name}`);
}
