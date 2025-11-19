import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, enum: ["HR", "Technical", "Behavioral"], required: true },
  expectedKeywords: [{ type: String }],
  difficulty: { type: String, default: "medium" },
  timeLimit: { type: Number, default: 60 } // seconds
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);
