// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();
connectDB();

const app = express();

// ✅ Apply CORS before routes
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", 
  credentials: true,
}));

// ✅ Use Helmet but disable COOP & COEP (fixes window.postMessage)
app.use(helmet({
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(morgan("dev"));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routers
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ Socket.IO
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

require("./socket")(io);
