import { Router } from "express";
import { client } from "../config";

const router = Router();

router.get("/", async (req, res) => {
  const limit = parseInt(
    typeof req.query.limit === "string" ? req.query.limit : "50"
  );
  const offset = parseInt(
    typeof req.query.offset === "string" ? req.query.offset : "0"
  );
  try {
    const rs = await client.execute({
      sql: "select * from posts order by createdAt desc limit ? offset ?",
      args: [limit, offset],
    });
    return res.status(200).json(rs.rows);
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
