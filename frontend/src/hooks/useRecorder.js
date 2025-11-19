import { useState, useRef } from "react";
import { socket } from "../utils/socket";

export default function useRecorder(sessionId, questionId) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  async function startRecording() {
    streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
      mimeType: "audio/webm"
    });

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(",")[1];
          socket.emit("audio-chunk", {
            sessionId,
            questionId,
            chunk: base64
          });
        };
        reader.readAsDataURL(e.data);
      }
    };

    mediaRecorderRef.current.start(300); // collect every 300 ms
    socket.emit("start-recording", { sessionId, questionId });

    setRecording(true);
  }

  async function stopRecording(transcript = "") {
    mediaRecorderRef.current.stop();
    streamRef.current.getTracks().forEach((t) => t.stop());

    socket.emit("stop-recording", {
      sessionId,
      questionId,
      transcript
    });

    setRecording(false);
  }

  return { recording, startRecording, stopRecording };
}
