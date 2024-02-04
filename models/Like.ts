import { Row } from "@libsql/client/.";

export default class Like {
  lid: string;
  sid: string;
  uid: string;
  timestamp: Date;

  constructor(lid: string, sid: string, uid: string, timestamp: Date) {
    this.lid = lid;
    this.sid = sid;
    this.uid = uid;
    this.timestamp = timestamp;
  }

  static fromRow(row: Row): Like | null {
    if (
      typeof row.lid !== "string" ||
      typeof row.sid !== "string" ||
      typeof row.uid !== "string" ||
      typeof row.timestamp !== "string"
    )
      return null;
    return new Like(row.lid, row.sid, row.uid, new Date(row.timestamp));
  }
}
