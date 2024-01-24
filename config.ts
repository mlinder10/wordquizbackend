import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
dotenv.config();

export const client = createClient({
  url: process.env.DB_URI ?? "",
  authToken: process.env.DB_API_KEY ?? "",
});

export function checkApiKey(req: Request, res: Response, next: NextFunction) {
  if (req.headers["api-key"] !== process.env.API_KEY) {
    return res.status(401).json({ message: "Invalid API key" });
  }
  next();
}

export function getReqOptions(req: Request, res: Response, next: NextFunction) {
  const limit = parseInt(
    typeof req.query.limit === "string" ? req.query.limit : "50"
  );
  const offset = parseInt(
    typeof req.query.offset === "string" ? req.query.offset : "0"
  );
  req.body.limit = limit;
  req.body.offset = offset;
  req.body.shuffle = typeof req.query.shuffle === "string" && req.query.shuffle === "true";
  next();
}