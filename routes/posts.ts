import { Router } from "express";
import { client, getReqOptions } from "../config";

const router = Router();
router.use(getReqOptions);

router.get("/", async (req, res) => {
  const { limit, offset } = req.body;

  try {
    if (req.body.shuffle) {
      const rs = await client.execute({
        sql: "select * from posts order by random() limit ? offset ?",
        args: [limit, offset],
      });
      return res.status(200).json(rs.rows);
    }

    const rs = await client.execute({
      sql: "select * from posts limit ? offset ?",
      args: [limit, offset],
    });
    return res.status(200).json(rs.rows);
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:search", async (req, res) => {
  const { search } = req.params;
  try {
    const rs = await client.execute({
      sql: "select * from posts where title like ?",
      args: [`%${search}%`],
    });
    return res.status(200).json(rs.rows);
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
