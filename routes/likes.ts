import { Router } from "express";
import { client } from "../config";
import { v4 as uuid } from "uuid";
import Set from "../models/Set";

const router = Router();

/**
 * Add or remove like from set
 */
router.patch("/:sid", async (req, res) => {
  const { sid } = req.params;
  const { uid } = req.body;

  try {
    const rs = await client.execute({
      sql: "select * from likes where sid = ? and uid = ?",
      args: [sid, uid],
    });
    if (rs.rows.length === 0) {
      const rs = await client.batch([
        {
          sql: "insert into likes (lid, sid, uid, timestamp) values (?, ?, ?, ?)",
          args: [uuid(), sid, uid, new Date().toISOString()],
        },
        {
          sql: "update sets set likes = likes + 1 where sid = ?",
          args: [sid],
        },
        {
          sql: `select
                  sets.*,
                  case when likes.uid is not null then 1 else 0 end as liked,
                  case when favorites.uid is not null then 1 else 0 end as favorited
                from
                  sets
                left join
                  likes on sets.sid = likes.sid and likes.uid = ?
                left join
                  favorites on sets.sid = favorites.sid and favorites.uid = ?
                where
                  sets.sid = ?`,
          args: [uid, uid, sid],
        },
      ]);
      return res.status(202).json(Set.fromRow(rs[2].rows[0]));
    } else {
      const rs = await client.batch([
        {
          sql: "delete from likes where sid = ? and uid = ?",
          args: [sid, uid],
        },
        {
          sql: "update sets set likes = likes - 1 where sid = ?",
          args: [sid],
        },
        {
          sql: `select
                  sets.*,
                  case when likes.uid is not null then 1 else 0 end as liked,
                  case when favorites.uid is not null then 1 else 0 end as favorited
                from
                  sets
                left join
                  likes on sets.sid = likes.sid and likes.uid = ?
                left join
                  favorites on sets.sid = favorites.sid and favorites.uid = ?
                where
                  sets.sid = ?`,
          args: [uid, uid, sid],
        },
      ]);
      return res.status(202).json(Set.fromRow(rs[2].rows[0]));
    }
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
