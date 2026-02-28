import "dotenv/config";

if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.DATABASE_URL;
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "",
};

if (!env.DATABASE_URL) {
  console.error("❌ LA VARIABLE NO LLEGÓ AL ENV.TS");
}