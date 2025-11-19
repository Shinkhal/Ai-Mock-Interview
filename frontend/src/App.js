import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AIInterviewLanding from "./pages/Landing";
import StartInterviewForm from "./pages/StartInterview";
import InterviewSession from "./pages/InterviewSession";
import InterviewReport from "./pages/InterviewReport";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AIInterviewLanding />} />
        <Route path="/start" element={<StartInterviewForm />} />
        <Route path="/session/:sessionId" element={<InterviewSession />} />
        <Route path="/report/:sessionId" element={<InterviewReport />} />

      </Routes>
    </Router>
  );
}

export default App;
