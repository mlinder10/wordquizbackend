import { Router } from "express";
import { client } from "../config";
import { v4 as uuid } from "uuid";
import Set from "../models/Set";

const router = Router();

router.get("/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const rs = await client.execute({
      sql: `select
              sets.*,
              case when likes.uid is not null then 1 else 0 end as liked,
              case when favorites.uid is not null then 1 else 0 end as favorited
            from
                sets
            left join
                likes on sets.sid = likes.sid and likes.uid = ?
            join
                favorites on sets.sid = favorites.sid
            where
                favorites.uid = ?`,
      args: [uid, uid],
    });
    return res.status(200).json(rs.rows.map((row) => Set.fromRow(row)));
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Add or remove favorite from set
 */
router.patch("/:sid", async (req, res) => {
  const { sid } = req.params;
  const { uid } = req.body;

  try {
    const rs = await client.execute({
      sql: "select * from favorites where sid = ? and uid = ?",
      args: [sid, uid],
    });
    if (rs.rows.length === 0) {
      const rs = await client.batch([
        {
          sql: "insert into favorites (fid, sid, uid, timestamp) values (?, ?, ?, ?)",
          args: [uuid(), sid, uid, new Date().toISOString()],
        },
        {
          sql: "update sets set favorites = favorites + 1 where sid = ?",
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
          sql: "delete from favorites where sid = ? and uid = ?",
          args: [sid, uid],
        },
        {
          sql: "update sets set favorites = favorites - 1 where sid = ?",
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
