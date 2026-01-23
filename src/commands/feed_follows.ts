import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";
import { getFeedByUrl } from "src/lib/db/queries/feeds";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed_follows";

export async function printFeedFollow(userName: string, feedName: string) {
  console.log(`${userName} is now following ${feedName}`);
}

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: npm run start ${cmdName} <url>`);
  }

  const config = readConfig();
  const user = await getUser(config.currentUserName);
  if (!user) {
    throw new Error(`User ${config.currentUserName} not found.`);
  }
  const url = args[0];

  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`No feed found for url ${url}`);
  }

  const newFollow = await createFeedFollow(user.id, feed.id);
  printFeedFollow(newFollow.userName, newFollow.feedName);
}

export async function handlerFollowing(cmdName: string) {
  const config = readConfig();
  const user = await getUser(config.currentUserName);
  if (!user) {
    throw new Error(`User ${config.currentUserName} not found.`);
  }

  const feeds = await getFeedFollowsForUser(user.id);
  if (feeds.length === 0) {
    console.log(`No feed follows found for ${user.name}.`);
  }

  console.log(`Feeds followed by ${user.name}:`);
  for (const feed of feeds) {
    console.log(`* ${feed.feedName}`);
  }
}
