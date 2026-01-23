import { readConfig } from "src/config";
import { CommandHandler, UserCommandHandler } from "./commands";
import { getUser } from "src/lib/db/queries/users";

export function middlewareLoggedIn(
  handler: UserCommandHandler,
): CommandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const { currentUserName } = readConfig();
    if (!currentUserName) {
      throw new Error("No user logged in.");
    }

    const user = await getUser(currentUserName);
    if (!user) {
      throw new Error(`User ${currentUserName} not found`);
    }

    await handler(cmdName, user, ...args);
  };
}
