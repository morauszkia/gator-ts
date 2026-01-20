import { XMLParser } from "fast-xml-parser";

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
