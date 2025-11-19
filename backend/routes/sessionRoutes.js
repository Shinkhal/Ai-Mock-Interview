import express from "express";
import {
  startSession,
  getNextQuestion,
  finishSession
} from "../controllers/sessionController.js";
import { upload } from "../middleware/uploadAudio.js";
import { submitAnswerREST } from "../controllers/answerController.js";



const router = express.Router();

router.post("/start", startSession);
router.get("/:id/next", getNextQuestion);
router.post("/:id/finish", finishSession);
router.post("/:sessionId/answer/:questionId", upload.single("audio"), submitAnswerREST);

export default router;
