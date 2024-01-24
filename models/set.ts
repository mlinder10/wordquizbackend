import { Row } from "@libsql/client/.";
import User from "./user";
import { v4 as uuid } from "uuid";

export class Set {
  sid: string;
  posts: string[];
  uid: string;
  email: string;
  username: string;
  createdAt: string;

  constructor(
    sid: string,
    posts: string[],
    uid: string,
    email: string,
    username: string,
    createdAt: string
  ) {
    this.sid = sid;
    this.posts = posts;
    this.uid = uid;
    this.email = email;
    this.username = username;
    this.createdAt = createdAt;
  }

  static fromRow(row: Row): Set | null {
    if (
      typeof row.sid !== "string" ||
      typeof row.posts !== "string" ||
      typeof row.uid !== "string" ||
      typeof row.email !== "string" ||
      typeof row.username !== "string" ||
      typeof row.createdAt !== "string"
    )
      return null;
    return new Set(
      row.sid,
      JSON.parse(row.posts),
      row.uid,
      row.email,
      row.username,
      row.createdAt
    );
  }

  static create(user: User, posts: string[]): Set {
    return new Set(
      uuid(),
      posts,
      user.uid,
      user.email,
      user.username,
      new Date().toISOString()
    );
  }
}