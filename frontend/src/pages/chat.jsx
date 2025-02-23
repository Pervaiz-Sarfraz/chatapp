import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import AuthContext from "../context/AuthContext";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Load chat history when component mounts
  useEffect(() => {
    socket.on("chat_history", (history) => {
      setMessages(history);
    });

    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
    };
  }, []);

  // Send message to the server
  const sendMessage = () => {
    if (!user) {
      alert("You must be logged in to send messages.");
      return;
    }

    if (message.trim() === "") return;

    const newMessage = {
      user: user?.name || "Guest", // Prevent crash if user is null
      text: message,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", newMessage);
    setMessage(""); // Clear input after sending
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>{msg.user}:</strong> {msg.text} <br />
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Send on Enter key
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
