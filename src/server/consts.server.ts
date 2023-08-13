import path from "path";
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
export const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;

export const SERVER_DIR = __dirname;
export const ROOT_DIR = path.resolve(SERVER_DIR, "../../");
export const DIST_DIR = path.resolve(ROOT_DIR, "dist");

export const PORT = Number(process.env.PORT || "3000");
export const WS_PORT = Number(process.env.WS_PORT || "3001");
