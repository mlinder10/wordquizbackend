import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
// import postsRouter from "./routes/posts";
// import setsRouter from "./routes/sets";
// import likesRouter from "./routes/likes";
// import favoritesRouter from "./routes/favorites";
// import { checkApiKey } from "./config";

const PORT = process.env.PORT ?? 3000;
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
// app.use(checkApiKey);

app.get("/", (req, res) => res.status(200).json("hello world"))

// app.use("/auth", authRouter);
// app.use("/posts", postsRouter);
// app.use("/sets", setsRouter);
// app.use("/likes", likesRouter);
// app.use("/favorites", favoritesRouter);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
