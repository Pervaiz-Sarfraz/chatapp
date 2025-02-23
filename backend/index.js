import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mongoose from "mongoose";
import Message from "./models/Message.js";

dotenv.config();
connectDB();

const app = express();
const server = createServer(app); // Create HTTP server

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/chatapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.get("/", (req, res) => {
  res.send("Chat App Backend Running");
});
app.use("/api/auth", authRoutes);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow frontend to connect
    methods: ["GET", "POST"],
  },
});

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send chat history when a user connects
  Message.find()
    .sort({ timestamp: 1 })
    .then((messages) => {
      socket.emit("chat_history", messages);
    });

  // Listen for messages
  socket.on("send_message", async (data) => {
    const newMessage = new Message({
      user: data.user,
      text: data.text,
      timestamp: new Date(),
    });

    await newMessage.save(); // Save to MongoDB
    io.emit("receive_message", newMessage); // Broadcast to all users
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
