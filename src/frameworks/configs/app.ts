import express, { Express } from "express";
import dotenv from "dotenv";
import userRouter from "../routes/userRoutes";
import cors from "cors";
import adminRouter from "../routes/adminRoutes";

dotenv.config();

const app: Express = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.use(express.urlencoded({ extended: true }));

export default app;
