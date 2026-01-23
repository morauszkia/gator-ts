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
  registerCommand(registry, "addfeed", handlerAddFeed);
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand(registry, "follow", handlerFollow);
  registerCommand(registry, "following", handlerFollowing);

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
