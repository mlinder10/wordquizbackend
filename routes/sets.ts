import { Router } from "express";
import { client, getReqOptions, generateGameString, metrics } from "../config";
import Set from "../models/Set";

const router = Router();
// Setup middleware to pull limit and offset from query
router.use(getReqOptions);

/**
 * Get recent sets
 */
router.get("/", async (req, res) => {
  const { uid, limit, offset } = req.body;
  const orderBy = req.body.shuffle ? "random()" : "createdAt desc";
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
            left join
              favorites on sets.sid = favorites.sid and favorites.uid = ?
            order by
              ${orderBy}
            limit ?
            offset ?`,
      args: [uid, uid, limit, offset],
    });
    return res.status(200).json(rs.rows.map((row) => Set.fromRow(row)));
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Get sets associated with uid
 */
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
            left join
              favorites on sets.sid = favorites.sid and favorites.uid = ?
            where
              sets.uid = ?`,
      args: [uid, uid, uid],
    });
    return res.status(200).json(rs.rows.map((row) => Set.fromRow(row)));
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Get popular sets by likes, favorites, quizes played, or flashcards reviewed
 */
router.get("/popular/:metric", async (req, res) => {
  const { metric } = req.params;
  const { uid, limit, offset } = req.body;
  try {
    if (!metrics.includes(metric))
      return res.status(400).json({ message: "Invalid metric" });
    const rs = await client.execute({
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
            order by
              ${metric} desc
            limit ?
            offset ?`,
      args: [uid, uid, limit, offset],
    });
    return res.status(200).json(rs.rows.map((row) => Set.fromRow(row)));
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Create new set
 */
router.post("/", async (req, res) => {
  const { user, posts, name } = req.body;
  const set = Set.create(user, posts, name);
  try {
    await client.execute({
      sql: "insert into sets (sid, name, posts, uid, email, username, createdAt) values (?, ?, ?, ?, ?, ?, ?)",
      args: [
        set.sid,
        set.name,
        JSON.stringify(set.posts),
        set.uid,
        set.email,
        set.username,
        set.createdAt,
      ],
    });
    return res.status(200).json(set);
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Increment game count
 */
router.patch("/:sid", async (req, res) => {
  try {
    const { game } = req.body;
    const column = generateGameString(game);
    if (column === null)
      return res.status(400).json({ message: "Invalid game" });
    await client.execute({
      sql: `update sets set ${column} = ${column} + 1 where sid = ?`,
      args: [req.params.sid],
    });
    return res.status(200).json({ message: "success" });
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Delete set by sid
 */
router.delete("/:sid", async (req, res) => {
  try {
    await client.execute({
      sql: "delete from sets where sid = ?",
      args: [req.params.sid],
    });
    return res.status(200).json({ message: "success" });
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
