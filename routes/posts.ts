import { Router } from "express";
import { client, getReqOptions } from "../config";
import Post from "../models/post";

const router = Router();
router.use(getReqOptions);

router.get("/", async (req, res) => {
  const { limit, offset } = req.body;

  try {
    const rs = await client.execute({
      sql: "select * from posts order by createdAt desc limit ? offset ?",
      args: [limit, offset],
    });

    if (req.body.shuffle)
      return res.status(200).json(Post.shuffle(rs.rows));
    return res.status(200).json(rs.rows);
    
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
