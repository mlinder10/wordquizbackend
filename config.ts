import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
dotenv.config();

export const client = createClient({
  url: process.env.DB_URI ?? "",
  authToken: process.env.DB_API_KEY ?? "",
});

export function checkApiKey(req: any, res: any, next: any) {
  if (req.headers["api-key"] !== process.env.API_KEY) {
    return res.status(401).json({ message: "Invalid API key" });
  }
  next();
}