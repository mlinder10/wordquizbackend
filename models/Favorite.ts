import { Row } from "@libsql/client/.";

export default class Favorite {
  fid: string;
  uid: string;
  sid: string;
  timestamp: Date;

  constructor(fid: string, uid: string, sid: string, timestamp: Date) {
    this.fid = fid;
    this.uid = uid;
    this.sid = sid;
    this.timestamp = timestamp;
  }

  static fromRow(row: Row): Favorite | null {
    if (
      typeof row.fid !== "string" ||
      typeof row.uid !== "string" ||
      typeof row.sid !== "string" ||
      typeof row.timestamp !== "string"
    )
      return null;
    return new Favorite(row.fid, row.uid, row.sid, new Date(row.timestamp));
  }
}
