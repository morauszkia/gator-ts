import { readConfig, setUser } from "./config";

function main() {
  setUser("myUserName");
  const config = readConfig();
  console.log(config);
}

main();
