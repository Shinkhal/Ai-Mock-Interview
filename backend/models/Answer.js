import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewSession" },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  audioUrl: String,
  transcript: String,
  score: Number,
  feedback: String
});

export default mongoose.model("Answer", answerSchema);
