import { Router } from "express";
import { client } from "../config";
import { User } from "../models/User";

const router = Router();

router.get("/", async (req, res) => {
  const rs = await client.execute("select * from users");
  res.status(200).json(rs.rows.map((row) => User.fromRow(row)));
});

export default router;
