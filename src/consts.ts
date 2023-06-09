import dotenv from "dotenv";
dotenv.config();

const getFromEnvOrThrowFit = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new Error(`Couldn't find key ${key} in env`);
  return val;
};

export const AUTH_TOKEN = getFromEnvOrThrowFit("AUTH_TOKEN");
export const ORG = getFromEnvOrThrowFit("ORG");
export const REPO = getFromEnvOrThrowFit("REPO");
