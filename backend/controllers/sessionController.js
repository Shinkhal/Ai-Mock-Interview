import InterviewSession from "../models/InterviewSession.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import { scoreAnswer, generateFeedback } from "../utils/scoring.js";

// START SESSION
export const startSession = async (req, res) => {
  try {
    const { name, email, category, totalQuestions } = req.body;
    const count = Number(totalQuestions);

    const questions = await Question.aggregate([
      { $match: { category } },
      { $sample: { size: count } }
    ]);

    const session = await InterviewSession.create({
      candidate: { name, email },
      category,
      questions: questions.map(q => q._id),
      currentIndex: 0
    });

    res.json({
      success: true,
      message: "Session started",
      session
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET NEXT QUESTION
export const getNextQuestion = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    let index = session.currentIndex;

    // If finished
    if (index >= session.questions.length) {
      return res.json({ success: true, done: true });
    }

    // Fetch question
    const question = await Question.findById(session.questions[index]);

    // IMPORTANT: Increment currentIndex for REST flow
    await InterviewSession.findByIdAndUpdate(req.params.id, {
      $inc: { currentIndex: 1 }
    });

    res.json({
      success: true,
      question,
      currentIndex: index + 1,
      total: session.questions.length
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// FINISH SESSION (Full scoring)
export const finishSession = async (req, res) => {
  try {
    const sessionId = req.params.id;

    const session = await InterviewSession.findById(sessionId).populate("questions");
    const answers = await Answer.find({ sessionId });

    let totalScore = 0;
    let strengths = [];
    let weaknesses = [];
    let report = [];

    for (let ans of answers) {
      const question = session.questions.find(q => q._id.toString() === ans.questionId.toString());

      if (!question) continue;

      // Scoring
      const score = scoreAnswer(ans.transcript || "", question.expectedKeywords);
      const feedback = generateFeedback(ans.transcript || "", question.expectedKeywords);

      ans.score = score;
      ans.feedback = feedback.join(" ");
      await ans.save();

      totalScore += score;

      // strengths / weaknesses
      if (score >= 7.5) strengths.push(question.text);
      if (score < 5) weaknesses.push(question.text);

      report.push({
        question: question.text,
        answer: ans.transcript,
        audioUrl: ans.audioUrl,
        score,
        feedback
      });
    }

    const overall = Number((totalScore / answers.length).toFixed(1));

    await InterviewSession.findByIdAndUpdate(sessionId, {
      completed: true,
      overallScore: overall,
      strengths,
      weaknesses,
      summary: `Candidate performed with an overall score of ${overall}/10`
    });

    res.json({
      success: true,
      overallScore: overall,
      strengths,
      weaknesses,
      report
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
