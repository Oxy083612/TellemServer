import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../../DB.env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn("dotenv: nie znaleziono pliku .env w:", envPath);
} else {
  console.log("dotenv: wczytano zmienne:", Object.keys(result.parsed || {}));
}

export function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Env variable ${name} is required`);
  return v;
}