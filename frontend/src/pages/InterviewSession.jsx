import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../utils/socket";
import Avatar from "../components/Avatar";
import useRecorder from "../hooks/useRecorder";
import { speak } from "../utils/tts";
import { Mic, Square, Clock, Sparkles, Volume2, VolumeX } from "lucide-react";

export default function InterviewSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [questionId, setQuestionId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [progress, setProgress] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);

  const timerRef = useRef(null);

  const { recording, startRecording, stopRecording } = useRecorder(sessionId, questionId);

  // Calculate progress percentage for timer
  const getTimePercentage = () => {
    if (!timeLeft || !question?.timeLimit) return 100;
    return (timeLeft / (question.timeLimit || 60)) * 100;
  };

  // Start countdown timer
  const beginTimer = (seconds) => {
    setTimeLeft(seconds);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          stopRecording("");
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
      setQuestionNumber((prev) => prev + 1);

      clearInterval(timerRef.current);
      setTimeLeft(null);

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
    beginTimer(question.timeLimit || 60);
  };

  const handleStopRecording = () => {
    clearInterval(timerRef.current);
    stopRecording("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b-2 border-purple-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Interview Session</h2>
              <p className="text-sm text-gray-600">Session ID: {sessionId?.slice(0, 8)}...</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 px-4 py-2 rounded-full border border-purple-200">
              <span className="text-sm font-medium text-purple-700">
                Question {questionNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Avatar Section */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Avatar speaking={speaking} />
            
            {/* Speaking Indicator */}
            {speaking && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg animate-pulse">
                  <Volume2 className="w-4 h-4" />
                  <span>AI is speaking...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          
          {question ? (
            <>
              {/* Question Card */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 p-8 mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-4">
                      {question.category || "General"} Round
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
                      {question.text}
                    </h1>
                  </div>
                </div>

                {/* Recording Timer */}
                {recording && timeLeft !== null && (
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Clock className="w-6 h-6 text-red-600" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                          </div>
                          <span className="text-lg font-semibold text-gray-900">Time Remaining</span>
                        </div>
                        <div className="text-3xl font-bold text-red-600 tabular-nums">
                          {formatTime(timeLeft)}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-1000 ease-linear"
                          style={{ width: `${getTimePercentage()}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {!recording ? (
                    <button
                      onClick={handleStartRecording}
                      disabled={speaking}
                      className="group flex-1 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 shadow-lg"
                    >
                      <Mic className="w-5 h-5 group-hover:scale-110 transition" />
                      <span>Start Answering</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="group flex-1 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
                    >
                      <Square className="w-5 h-5 group-hover:scale-110 transition" />
                      <span>Stop Recording</span>
                    </button>
                  )}
                </div>

                {/* Recording Status */}
                {recording && (
                  <div className="mt-4 flex items-center justify-center space-x-2 text-red-600">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Recording in progress...</span>
                  </div>
                )}
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 border-2 border-purple-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Quick Tips</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Take a moment to think before you start speaking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Structure your answer with clear beginning, middle, and end</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Use specific examples from your experience when possible</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading your next question...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}