import { Row } from "@libsql/client/.";
import User from "./User";
import { v4 as uuid } from "uuid";
import Post from "./Post";

export default class Set {
  sid: string;
  name: string;
  posts: string[];
  uid: string;
  email: string;
  username: string;
  createdAt: string;
  quizesPlayed: number;
  flashcardsPlayed: number;
  likes: number;
  favorites: number;
  liked: boolean;
  favorited: boolean;

  constructor(
    sid: string,
    name: string,
    posts: string[],
    uid: string,
    email: string,
    username: string,
    createdAt: string,
    quizesPlayed: number,
    flashcardsPlayed: number,
    likes: number,
    favorites: number,
    liked: boolean,
    favorited: boolean
  ) {
    this.sid = sid;
    this.name = name;
    this.posts = posts;
    this.uid = uid;
    this.email = email;
    this.username = username;
    this.createdAt = createdAt;
    this.quizesPlayed = quizesPlayed;
    this.flashcardsPlayed = flashcardsPlayed;
    this.likes = likes;
    this.favorites = favorites;
    this.liked = liked;
    this.favorited = favorited;
  }

  static fromRow(row: Row): Set | null {
    if (
      typeof row.sid !== "string" ||
      typeof row.name !== "string" ||
      typeof row.posts !== "string" ||
      typeof row.uid !== "string" ||
      typeof row.email !== "string" ||
      typeof row.username !== "string" ||
      typeof row.createdAt !== "string" ||
      typeof row.quizesPlayed !== "number" ||
      typeof row.flashcardsPlayed !== "number" ||
      typeof row.likes !== "number" ||
      typeof row.favorites !== "number" ||
      typeof row.liked !== "number" ||
      typeof row.favorited !== "number"
    )
      return null;
    return new Set(
      row.sid,
      row.name,
      JSON.parse(row.posts),
      row.uid,
      row.email,
      row.username,
      row.createdAt,
      row.quizesPlayed,
      row.flashcardsPlayed,
      row.likes,
      row.favorites,
      row.liked === 1,
      row.favorited === 1
    );
  }

  static create(user: User, posts: Post[], name: string): Set {
    return new Set(
      uuid(), // sid
      name, // name
      posts.map((post) => post.pid), // posts
      user.uid, // uid
      user.email, // email
      user.username, // username
      new Date().toISOString(), // createdAt
      0, // quizesPlayed
      0, // flashcardsPlayed
      0, // likes
      0, // favorites
      false, // liked
      false // favorited
    );
  }
}
