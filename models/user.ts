import { Row } from "@libsql/client";
import { client } from "../config";
import { v4 as uuid } from "uuid";

export class User {
  uid: string;
  email: string;
  username: string;
  password: string;
  profileImageUrl: string;
  followers: string[];
  following: string[];

  constructor(
    uid: string,
    email: string,
    username: string,
    password: string,
    profileImageUrl: string,
    followers: string[],
    following: string[]
  ) {
    this.uid = uid;
    this.email = email;
    this.username = username;
    this.password = password;
    this.profileImageUrl = profileImageUrl;
    this.followers = followers;
    this.following = following;
  }

  static fromRow(row: Row): User | null {
    if (
      typeof row.uid !== "string" ||
      typeof row.email !== "string" ||
      typeof row.username !== "string" ||
      typeof row.password !== "string" ||
      typeof row.profileImageUrl !== "string" ||
      typeof row.followers !== "string" ||
      typeof row.following !== "string"
    )
      return null;

    return new User(
      row.uid,
      row.email,
      row.username,
      row.password,
      row.profileImageUrl,
      JSON.parse(row.followers),
      JSON.parse(row.following)
    );
  }

  static async login(email: string, password: string): Promise<User | null> {
    try {
      const rs = await client.execute({
        sql: "select * from users where email = ? and password = ?",
        args: [email, password],
      });
      if (rs.rows.length === 0) return null;
      return User.fromRow(rs.rows[0]);
    } catch (err: any) {
      console.error(err?.message);
      return null;
    }
  }

  static async register(
    email: string,
    username: string,
    password: string
  ): Promise<User | null> {
    try {
      const rs = await client.execute({
        sql: "select * from users where email = ?",
        args: [email],
      });
      if (rs.rows.length > 0) return null;
      const uid = uuid();
      await client.execute({
        sql: "insert into users (uid, email, username, password, profileImageUrl, followers, following) values (?, ?, ?, ?, ?, ?, ?)",
        args: [uid, email, username, password, "", "[]", "[]"],
      });
      return new User(uid, email, username, password, "", [], []);
    } catch (err: any) {
      console.error(err?.message);
      return null;
    }
  }
}
