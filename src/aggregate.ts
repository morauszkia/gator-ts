import { fetchFeed } from "./feeds";

export async function handlerAggregate(_: string) {
  const feedUrl = "https://www.wagslane.dev/index.xml";

  const feedData = await fetchFeed(feedUrl);
  console.log(JSON.stringify(feedData, null, 2));
}
