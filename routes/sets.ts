import { Router } from "express";
import { client, generateGameString, getReqOptions } from "../config";
import { Set } from "../models/set";

const router = Router();
router.use(getReqOptions);
const games = ["quiz", "flashcards"];

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
      args: [limit, offset],
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

// router.get("/popular/:uid", async (req, res) => {
//   const { uid } = req.params;
//   const { limit, offset } = req.body;
//   try {
//     if (uid === "all") {
//       const rs = await client.execute({
//         sql: "select * from sets order by quizesPlayed + flashcardsPlayed desc limit ? offset ?",
//         args: [limit, offset],
//       });
//       return res.status(200).json(rs.rows.map((row) => Set.fromRow(row)));
//     }
//   } catch (err: any) {
//     console.log(err?.message);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

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

router.patch("/:sid/like", async (req, res) => {
  const { sid } = req.params;
  const { uid } = req.body;
  try {
    const rs = await client.execute({
      sql: "select * from sets where sid = ?",
      args: [sid],
    });
    const set = Set.fromRow(rs.rows[0]);
    if (!set) return res.status(404).json({ message: "Set not found" });
    if (set.likes.includes(uid)) {
      await client.execute({
        sql: "update sets set likes = ? where sid = ?",
        args: [JSON.stringify(set.likes.filter((like) => like !== uid)), sid],
      });
    } else {
      await client.execute({
        sql: "update sets set likes = ? where sid = ?",
        args: [JSON.stringify([...set.likes, uid]), sid],
      });
    }
    const rs2 = await client.execute({
      sql: "select * from sets where sid = ?",
      args: [sid],
    });
    return res.status(202).json(Set.fromRow(rs2.rows[0]));
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:sid/favorite", async (req, res) => {
  const { sid } = req.params;
  const { uid } = req.body;
  try {
    const rs = await client.execute({
      sql: "select * from sets where sid = ?",
      args: [sid],
    });
    const set = Set.fromRow(rs.rows[0]);
    if (!set) return res.status(404).json({ message: "Set not found" });
    if (set.favorites.includes(uid)) {
      await client.execute({
        sql: "update sets set favorites = ? where sid = ?",
        args: [JSON.stringify(set.favorites.filter((fav) => fav !== uid)), sid],
      });
    } else {
      await client.execute({
        sql: "update sets set favorites = ? where sid = ?",
        args: [JSON.stringify([...set.favorites, uid]), sid],
      });
    }
    const rs2 = await client.execute({
      sql: "select * from sets where sid = ?",
      args: [sid],
    });
    return res.status(202).json(Set.fromRow(rs2.rows[0]));
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

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
