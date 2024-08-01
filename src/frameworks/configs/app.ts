import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";

import http from "http";

//Routes
import userRouter from "../routes/userRoutes";
import adminRouter from "../routes/adminRoutes";
import friendRouter from "../routes/friendRoutes";
import communityRouter from "../routes/communityRoutes";

dotenv.config();

const app: Express = express();

export const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Routes
app.use("/user", userRouter);
app.use("/user", friendRouter);
app.use("/user", communityRouter);
app.use("/admin", adminRouter);

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("join", ({ room }) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("leave", ({ room }) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });

  socket.on("sendMessage", ({ room, message }) => {
    console.log(`Received message in room ${room}:`, message);
    io.to(room).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});
