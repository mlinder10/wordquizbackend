import { Router } from "express";
import User from "../models/User";
import { client } from "../config";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.login(email, password);
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });
    return res.status(200).json(user);
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await User.register(email, username, password);
    if (!user) return res.status(400).json({ message: "Email already exists" });
    return res.status(200).json(user);
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    await client.execute({
      sql: "delete from users where uid = ?",
      args: [uid],
    });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err: any) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
