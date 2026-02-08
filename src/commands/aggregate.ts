import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { formatDuration, parseDuration } from "src/lib/time";
import { scrapeFeeds } from "src/lib/feeds";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`Usage: npm run ${cmdName} <duration>`);
    }

    const enteredDuration = args[0];
    const timeBtwReqs = parseDuration(enteredDuration);

    if (!timeBtwReqs) {
        throw new Error(
            `Invalid duration: ${enteredDuration}. Please provide duration in hours (h), minutes (m), seconds(s) or milliseconds(ms) e.g. 3000ms or 1h`,
        );
    }

    console.log(`Collecting feeds every ${formatDuration(timeBtwReqs)}...`);

    try {
        scrapeFeeds();

        const interval = setInterval(() => {
            scrapeFeeds();
        }, timeBtwReqs);

        await new Promise<void>((resolve) => {
            process.on("SIGINT", () => {
                console.log("Exiting feed aggregator...");
                clearInterval(interval);
                resolve();
            });
        });
    } catch (error) {
        console.error(
            `Error scraping feeds: ${error instanceof Error ? error.message : error}`,
        );
    }
}
