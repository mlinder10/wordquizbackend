import { Row } from "@libsql/client";

class Post {
  pid: string;
  uid: string;
  word: string;
  definition: string;
  email: string;
  username: string;
  createdAt: Date;
  profileImageUrl: string;
  likes: string[];

  constructor(
    pid: string,
    uid: string,
    word: string,
    definition: string,
    email: string,
    username: string,
    createdAt: Date,
    profileImageUrl: string,
    likes: string[]
  ) {
    this.pid = pid;
    this.uid = uid;
    this.word = word;
    this.definition = definition;
    this.email = email;
    this.username = username;
    this.createdAt = createdAt;
    this.profileImageUrl = profileImageUrl;
    this.likes = likes;
  }

  static fromRow(row: Row): Post | null {
    if (
      typeof row.pid !== "string" ||
      typeof row.uid !== "string" ||
      typeof row.word !== "string" ||
      typeof row.definition !== "string" ||
      typeof row.email !== "string" ||
      typeof row.username !== "string" ||
      typeof row.createdAt !== "string" ||
      typeof row.profileImageUrl !== "string" ||
      typeof row.likes !== "string"
    )
      return null;

    return new Post(
      row.pid,
      row.uid,
      row.word,
      row.definition,
      row.email,
      row.username,
      new Date(row.createdAt),
      row.profileImageUrl,
      JSON.parse(row.likes)
    );
  }

  static shuffle(posts: Row[]): Row[] {
    const shuffled = posts.sort(() => Math.random() - 0.5);
    return shuffled;
  }
}

export default Post;
