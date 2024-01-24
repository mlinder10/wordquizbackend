import { Router } from "express";
import { client, getReqOptions } from "../config";
import { Set } from "../models/set";

const router = Router();
router.use(getReqOptions);

router.get("/", async (req, res) => {
  const { limit, offset } = req.body;

  try {
    if (req.body.shuffle) {
      const rs = await client.execute({
        sql: "select * from sets order by random() limit ? offset ?",
        args: [limit, offset],
      });
      return res.status(200).json(rs.rows.map((row) => Set.fromRow(row)));
    }

    const rs = await client.execute({
      sql: "select * from sets limit ? offset ?",
      args: [],
    });
    return res.status(200).json(rs.rows.map((row) => Set.fromRow(row)));
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:uid", async (req, res) => {
  try {
    const rs = await client.execute({
      sql: "select * from sets where uid = ?",
      args: [req.params.uid],
    });
    return res.status(200).json(rs.rows.map((row) => Set.fromRow(row)));
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { user, posts } = req.body;
  const set = Set.create(user, posts);
  try {
    await client.execute({
      sql: "insert into sets (sid, posts, uid, email, username, createdAt) values (?, ?, ?, ?, ?, ?)",
      args: [
        set.sid,
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
