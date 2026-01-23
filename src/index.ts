import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import {
  handlerUsers,
  handlerLogin,
  handlerRegister,
  handlerReset,
} from "./commands/users";
import { handlerAggregate } from "./commands/aggregate";
import { handlerAddFeed, handlerFeeds } from "./commands/feeds";
import { handlerFollow, handlerFollowing } from "./commands/feed_follows";
import { middlewareLoggedIn } from "./commands/middleware";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("Usage: npm start <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAggregate);
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error running command ${cmdName}: ${error.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${error}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
