import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../utils/socket";
import Avatar from "../components/Avatar";
import useRecorder from "../hooks/useRecorder";
import { speak } from "../utils/tts";

export default function InterviewSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [questionId, setQuestionId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const timerRef = useRef(null);

  const { recording, startRecording, stopRecording } = useRecorder(sessionId, questionId);

  // Start countdown timer
  const beginTimer = (seconds) => {
    setTimeLeft(seconds);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          stopRecording(""); // auto-stop when timer finishes
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    socket.emit("join-session", { sessionId, role: "candidate" });

    socket.emit("request-next-question", { sessionId });

    socket.on("question", (data) => {
      if (data.done) {
        navigate(`/report/${sessionId}`);
        return;
      }

      setQuestion(data.question);
      setQuestionId(data.question._id);

      // Reset timer
      clearInterval(timerRef.current);
      setTimeLeft(null);

      // speak question aloud
      speak(
        data.question.text,
        () => setSpeaking(true),
        () => setSpeaking(false)
      );
    });

    socket.on("answer-saved", () => {
      socket.emit("request-next-question", { sessionId });
    });

    return () => {
      socket.off("question");
      socket.off("answer-saved");
      clearInterval(timerRef.current);
    };
  }, []);

  const handleStartRecording = () => {
    startRecording();
    beginTimer(question.timeLimit || 60); // default 60 sec
  };

  return (
    <div className="min-h-screen p-10 flex flex-col items-center bg-gray-100">
      
      {/* Avatar */}
      <Avatar speaking={speaking} />

      {/* Question Box */}
      <div className="mt-10 max-w-2xl bg-white p-6 rounded-xl shadow-lg border border-purple-200 w-full md:w-3/5">
        {question ? (
          <>
            <h1 className="text-2xl font-semibold mb-4">{question.text}</h1>

            {/* TIMER UI */}
            {recording && (
              <div className="mb-4 text-xl font-bold text-red-600 flex items-center justify-center">
                ⏳ Time Left: <span className="ml-2">{timeLeft}s</span>
              </div>
            )}

            {/* Buttons */}
            {!recording ? (
              <button
                onClick={handleStartRecording}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700"
              >
                🎙️ Start Answering
              </button>
            ) : (
              <button
                onClick={() => {
                  clearInterval(timerRef.current);
                  stopRecording("");
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700"
              >
                ⏹ Stop Recording
              </button>
            )}
          </>
        ) : (
          <p>Loading question...</p>
        )}
      </div>
    </div>
  );
}
