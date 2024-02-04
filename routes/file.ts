import { Router } from "express";
import { client } from "../config";

const router = Router();

router.get("/", async (req, res) => {
  await client.execute("select * from users");
  res.status(200).json("ok");
});

export default router;
