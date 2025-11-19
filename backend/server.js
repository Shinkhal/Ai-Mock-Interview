// import express from 'express';;
// import cors from 'cors';
// import dotenv from 'dotenv';
// import morgan from 'morgan';
// import connectDB from './config/db.js';
// import questionRoutes from './routes/questionRoutes.js';

// const app = express();

// dotenv.config();
// app.use(express.json());
// app.use(cors());
// app.use(morgan('dev'));


// connectDB();


// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// app.use('/api/questions', questionRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



// server.js
import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import questionRoutes from "./routes/questionRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import socketHandlers from "./socketHandlers.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

// middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(morgan("dev"));

// DB
connectDB();

// API routes
app.use("/api/questions", questionRoutes);
app.use("/api/session", sessionRoutes);

// static uploads - serve saved audio files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("AI Interviewer Backend Running with Socket.IO...");
});

// init socket handlers (pass io)
socketHandlers(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
