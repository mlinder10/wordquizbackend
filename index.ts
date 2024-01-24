import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import postsRouter from "./routes/posts";
import setsRouter from "./routes/sets";
// import { checkApiKey } from "./config";

const PORT = process.env.PORT ?? 3000;
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
// app.use(checkApiKey);

app.use("/auth", authRouter);
app.use("/", postsRouter);
app.use("/sets", setsRouter);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
