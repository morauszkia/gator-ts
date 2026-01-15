import { setUser } from "./config";
import { createUser, getUser } from "./lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: npm run start ${cmdName} <name>`);
  }

  const userName = args[0];
  const existingUser = await getUser(userName);

  if (!existingUser) {
    throw new Error(`User ${userName} not found.`);
  }

  setUser(userName);
  console.log(`Current user set to ${userName}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: npm run start ${cmdName} <name>`);
  }

  const userName = args[0];

  const newUser = await createUser(userName);
  if (!newUser) {
    throw new Error(`User creation failed for ${userName}.`);
  }

  setUser(userName);
  console.log(`User created successfully.`);
}
