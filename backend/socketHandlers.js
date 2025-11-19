// socketHandlers.js
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import InterviewSession from "./models/InterviewSession.js";
import Question from "./models/Question.js";
import Answer from "./models/Answer.js";
import { scoreAnswer } from "./utils/scoring.js"; // existing scoring util

const uploadsDir = path.join(process.cwd(), "uploads", "audio");

// ensure uploads dir exists
fs.mkdirSync(uploadsDir, { recursive: true });

/**
 * In-memory map to hold write streams and metadata per session-question during streaming.
 * key: `${sessionId}_${questionId}`
 * value: { stream: WriteStream, filePath, receivedChunks: number, timer }
 */
const STREAMS = new Map();

export default function socketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Candidate or Admin joins a session room
    socket.on("join-session", async ({ sessionId, role }) => {
      if (!sessionId) return socket.emit("error", "no-session-id");
      socket.join(sessionId);
      socket.data.sessionId = sessionId;
      socket.data.role = role || "candidate";
      console.log(`${socket.id} joined room ${sessionId} as ${role}`);

      // optionally notify room
      io.to(sessionId).emit("participant-joined", { socketId: socket.id, role });
    });

    // Request server to push next question to the room
    socket.on("request-next-question", async ({ sessionId }) => {
      try {
        const session = await InterviewSession.findById(sessionId).populate("questions");
        if (!session) return socket.emit("error", "session-not-found");

        const index = session.currentIndex || 0;
        if (index >= session.questions.length) {
          io.to(sessionId).emit("question", { done: true });
          return;
        }

        const question = session.questions[index];
        // push question to everyone in the session room
        io.to(sessionId).emit("question", {
          question: {
            _id: question._id,
            text: question.text,
            category: question.category,
            timeLimit: question.timeLimit,
            expectedKeywords: question.expectedKeywords
          },
          index: index + 1,
          total: session.questions.length
        });

      } catch (err) {
        console.error("request-next-question error", err);
        socket.emit("error", "request-next-question-failed");
      }
    });

    // Candidate indicates they are ready to start recording (server can trigger UI)
    socket.on("start-recording", ({ sessionId, questionId }) => {
      // notify room (UI: animate avatar, show recording)
      io.to(sessionId).emit("recording-started", { questionId });
    });

    // Candidate stops recording; server finalizes audio file and creates Answer record
    socket.on("stop-recording", async ({ sessionId, questionId, transcript }) => {
      const key = `${sessionId}_${questionId}`;
      const meta = STREAMS.get(key);

      if (meta && meta.stream) {
        // finalize stream
        await new Promise((res, rej) => {
          meta.stream.end(() => {
            res();
          });
        });
        STREAMS.delete(key);

        // compute relative web path to be saved in DB
        const audioUrl = `/uploads/audio/${path.basename(meta.filePath)}`;

        // create Answer entry
        try {
          const answer = await Answer.create({
            sessionId,
            questionId,
            audioUrl,
            transcript: transcript || ""
          });

          // advance session index
          await InterviewSession.findByIdAndUpdate(sessionId, { $inc: { currentIndex: 1 } });

          // optional immediate scoring (or wait until finish)
          // you can score here and emit back
          const question = await Question.findById(questionId);
          const score = scoreAnswer(answer.transcript || "", question.expectedKeywords || []);
          answer.score = score;
          answer.feedback = `Auto feedback: score ${score}`;
          await answer.save();

          // emit saved event to room
          io.to(sessionId).emit("answer-saved", {
            questionId,
            audioUrl,
            transcript: answer.transcript,
            score,
            feedback: answer.feedback
          });
        } catch (err) {
          console.error("Error saving answer", err);
          socket.emit("error", "save-answer-failed");
        }
      } else {
        // If no stream exists (client uploaded final blob via REST or non-streaming), handle gracefully
        socket.emit("no-stream", { message: "No streaming session found; use REST upload fallback." });
      }
    });

    // Receive audio chunks (base64) from client and append to file.
    // Client should send events: 'audio-chunk' with { sessionId, questionId, chunk } where chunk is base64 string
    socket.on("audio-chunk", ({ sessionId, questionId, chunk }) => {
      try {
        const key = `${sessionId}_${questionId}`;

        // lazy init write stream
        if (!STREAMS.has(key)) {
          const filename = `${Date.now()}-${sessionId}-${questionId}.webm`;
          const filePath = path.join(uploadsDir, filename);
          const writeStream = fs.createWriteStream(filePath, { flags: "a" });

          STREAMS.set(key, { stream: writeStream, filePath, receivedChunks: 0, timer: null });

          // safety: auto-close stream if no chunks in N ms
          const safeTimeout = () => {
            const entry = STREAMS.get(key);
            if (entry && entry.stream) {
              entry.stream.end();
              STREAMS.delete(key);
              console.log(`Auto-closed stream for ${key}`);
            }
          };
          const t = setTimeout(safeTimeout, 1000 * 60 * 5); // 5 minutes
          STREAMS.get(key).timer = t;
        }

        const meta = STREAMS.get(key);
        // reset timer on activity
        if (meta.timer) {
          clearTimeout(meta.timer);
          meta.timer = setTimeout(() => {
            if (STREAMS.has(key)) {
              STREAMS.get(key).stream.end();
              STREAMS.delete(key);
            }
          }, 1000 * 60 * 5);
        }

        // decode base64 chunk and write
        const buffer = Buffer.from(chunk, "base64");
        meta.stream.write(buffer);
        meta.receivedChunks += 1;

        // optional live metrics back to client
        if (meta.receivedChunks % 20 === 0) {
          socket.emit("chunk-received", { sessionId, questionId, count: meta.receivedChunks });
        }

      } catch (err) {
        console.error("audio-chunk error", err);
        socket.emit("error", "audio-chunk-failed");
      }
    });

    // Optional: live STT integration hook: request partial transcript and emit 'live-transcript'
    // For now it's a placeholder; if you have a STT service, call it here with the latest buffer/chunk
    // Example: socket.on('request-live-transcript', ...)
    socket.on("request-live-transcript", ({ sessionId, questionId }) => {
      // Placeholder behavior: echo "processing..."
      io.to(sessionId).emit("live-transcript", { questionId, transcript: "Transcription placeholder..." });
      // Integrate with Whisper/Vosk here and emit real partial transcripts to the room.
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} - ${reason}`);
      // Optionally emit participant-left
      const { sessionId, role } = socket.data;
      if (sessionId) io.to(sessionId).emit("participant-left", { socketId: socket.id, role });

      // Clean up any streams that were associated with this socket? (We keyed by session+question)
      // Note: streams aren't keyed by socket id here; if you need per-socket streams, store socket id relation.
    });
  });
}
