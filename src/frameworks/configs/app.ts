import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import userRouter from "../routes/userRoutes";
import adminRouter from "../routes/adminRoutes";

dotenv.config();

const app: Express = express();

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

// Routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);

export default app;