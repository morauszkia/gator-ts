import path from "path";
import fs from "fs";
import os from "os";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

function getConfigPath(): string {
  const fileName = ".gatorconfig.json";
  return path.join(os.homedir(), fileName);
}

function validateConfig(assumedConfig: any): Config {
  if (!assumedConfig.db_url || typeof assumedConfig.db_url !== "string") {
    throw new Error("A db_url string is required in config.");
  }

  if (
    !assumedConfig.current_user_name ||
    typeof assumedConfig.current_user_name !== "string"
  ) {
    throw new Error("A current_user_name string is required in config");
  }

  return {
    dbUrl: assumedConfig.db_url,
    currentUserName: assumedConfig.current_user_name,
  };
}

export function readConfig(): Config {
  const configPath = getConfigPath();
  const jsonString = fs.readFileSync(configPath, { encoding: "utf-8" });
  const currentConfig = JSON.parse(jsonString);
  const validatedConfig = validateConfig(currentConfig);
  return validatedConfig;
}

export function setUser(userName: string) {
  const config = readConfig();
  config.currentUserName = userName;
  writeConfig(config);
}

function writeConfig(config: Config) {
  const configPath = getConfigPath();
  const snakeConfig = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName,
  };
  fs.writeFileSync(configPath, JSON.stringify(snakeConfig), {
    encoding: "utf-8",
  });
}
