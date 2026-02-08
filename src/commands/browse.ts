import { getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/schema";

const DEFAULT_LIMIT = 2;

export async function handlerBrowse(
    cmdName: string,
    user: User,
    ...args: string[]
) {
    if (args.length > 1) {
        throw new Error(`Usage: npm run ${cmdName} <num-of-posts>`);
    }
    let numPosts;

    if (args.length === 1) {
        numPosts = parseInt(args[0], 10);
        if (Number.isNaN(numPosts)) {
            console.log(
                `Number of posts to show could not be parsed. Using default limit of ${DEFAULT_LIMIT}`,
            );
            numPosts = 2;
        }
    } else {
        console.log(
            `You haven't specified number of posts to show. Using default limit of ${DEFAULT_LIMIT}
You can specify the number of posts by running "npm run ${cmdName} <num-of-posts>\n"`,
        );
        numPosts = DEFAULT_LIMIT;
    }

    console.log("===============================================");
    console.log("Latest Posts");
    console.log("===============================================");

    const posts = await getPostsForUser(user.id, numPosts);

    for (const post of posts) {
        console.log(`Title: ${post.title}`);
        console.log(`Feed: ${post.feedName}`);
        console.log(`URL: ${post.url}`);
        console.log(`Published: ${post.publishedAt}`);
        console.log("-----------------------------------------------");
    }
}
