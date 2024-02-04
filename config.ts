import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
dotenv.config();

export const metrics = [
  "likes",
  "favorites",
  "quizesPlayed",
  "flashcardsPlayed",
];

/**
 * Database connection
 */
export const client = createClient({
  url: process.env.DB_URI ?? "",
  authToken: process.env.DB_API_KEY ?? "",
});

/**
 * Verify API key (not yet implemented)
 */
export function checkApiKey(req: Request, res: Response, next: NextFunction) {
  if (req.headers["api-key"] !== process.env.API_KEY) {
    return res.status(401).json({ message: "Invalid API key" });
  }
  next();
}

/**
 * Pull request limit and offset from query to body or initialize to default if not specified
 */
export function getReqOptions(req: Request, res: Response, next: NextFunction) {
  const limit = parseInt(
    typeof req.query.limit === "string" ? req.query.limit : "50"
  );
  const offset = parseInt(
    typeof req.query.offset === "string" ? req.query.offset : "0"
  );
  const uid = typeof req.query.uid === "string" ? req.query.uid : "guest";
  req.body.limit = limit;
  req.body.offset = offset;
  req.body.uid = uid;
  req.body.shuffle =
    typeof req.query.shuffle === "string" && req.query.shuffle === "true";
  next();
}

export function generateGameString(game: string) {
  switch (game) {
    case "quiz":
      return "quizesPlayed";
    case "flashcards":
      return "flashcardsPlayed";
    default:
      return null;
  }
}
