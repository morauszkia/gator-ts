import { setUser } from "./config";

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: npm run start ${cmdName} <username>`);
  }

  const userName = args[0];
  setUser(userName);
  console.log(`Current user set to ${userName}`);
}
