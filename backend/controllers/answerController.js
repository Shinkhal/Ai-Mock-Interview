import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import InterviewSession from "../models/InterviewSession.js";
import { scoreAnswer, generateFeedback } from "../utils/scoring.js";

export const submitAnswerREST = async (req, res) => {
  try {
    const { sessionId, questionId } = req.params;
    const transcript = req.body.transcript || "";

    const audioUrl = req.file
      ? `/uploads/audio/${req.file.filename}`
      : null;

    // create answer entry
    let answer = await Answer.create({
      sessionId,
      questionId,
      transcript,
      audioUrl
    });

    // scoring
    const question = await Question.findById(questionId);
    const score = scoreAnswer(transcript, question.expectedKeywords);
    const feedback = generateFeedback(transcript, question.expectedKeywords);

    answer.score = score;
    answer.feedback = feedback.join(" ");
    await answer.save();

    // increment session index
    await InterviewSession.findByIdAndUpdate(sessionId, {
      $inc: { currentIndex: 1 }
    });

    res.json({
      success: true,
      message: "Answer saved",
      answer
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
