import "dotenv/config";

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL;
}

if (process.env.JWT_SECRET) {
  process.env.JWT_SECRET = process.env.JWT_SECRET;
}

if (process.env.ORIGIN) {
  process.env.ORIGIN = process.env.ORIGIN;
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  ORIGIN: process.env.ORIGIN || "http://localhost:5173"
};

if (!env.DATABASE_URL) {
  console.error("❌ LA VARIABLE NO LLEGÓ AL ENV.TS");
}