import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  candidate: {
    name: String,
    email: String,
  },
  category: String, 
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  currentIndex: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  overallScore: Number,
  strengths: [String],
  weaknesses: [String],
  summary: String,
}, { timestamps: true });

export default mongoose.model("InterviewSession", sessionSchema);
