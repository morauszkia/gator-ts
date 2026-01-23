import { XMLParser } from "fast-xml-parser";
import { getUserById } from "../lib/db/queries/users";
import { createFeed, getAllFeeds } from "../lib/db/queries/feeds";
import { Feed, User } from "../lib/db/schema";
import { createFeedFollow } from "src/lib/db/queries/feed_follows";
import { printFeedFollow } from "./feed_follows";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "gator",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch RSS feed!");
  }

  const xmlText = await res.text();
  const parser = new XMLParser();
  const parsedData = parser.parse(xmlText);

  const channel = parsedData.rss?.channel;

  if (!channel) {
    throw new Error("Channel missing from data!");
  }

  if (!channel.title || !channel.link || !channel.description) {
    throw new Error("Failed to parse channel");
  }

  const items: any[] = Array.isArray(channel.item)
    ? channel.item
    : [channel.item];
  const parsedItems: RSSItem[] = items
    .filter(
      (item) =>
        item && item.title && item.link && item.description && item.pubDate,
    )
    .map((item) => ({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    }));

  const feedData: RSSFeed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: parsedItems,
    },
  };

  return feedData;
}

function printFeed(feed: Feed, user: User) {
  console.log(`${feed.name} (${feed.url}) - added by ${user.name}`);
}

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length < 2) {
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
