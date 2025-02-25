import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import connectDB from "./config/db.js";
import authRoutes from "./routes/User.js";
import mongoose from "mongoose";
import Message from "./models/Message.js";

dotenv.config();
connectDB();

const app = express();
const server = createServer(app); 

app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Chat App Backend Running");
});
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
