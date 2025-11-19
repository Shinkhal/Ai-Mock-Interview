import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Star } from "lucide-react";

export default function InterviewReport() {
  const { sessionId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/session/${sessionId}/finish`
        );
        setReport(res.data);
      } catch (err) {
        console.error("Report fetch error:", err);
      }
      setLoading(false);
    }

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Generating your report...</p>
      </div>
    );
  }

  if (!report) {
    return <p>Error loading report.</p>;
  }

  const { overallScore, strengths, weaknesses, report: answers } = report;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl border border-purple-200">
        <h1 className="text-4xl font-bold text-center mb-4">
          Interview Report
        </h1>

        {/* Overall Score */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold">Overall Score</h2>
          <div className="mt-4 text-6xl font-bold text-purple-600">
            {overallScore}/10
          </div>
        </div>

        {/* Strengths */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-green-600">
            <CheckCircle /> Strengths
          </h3>
          <ul className="list-disc ml-6 text-gray-700">
            {strengths.length > 0 ? (
              strengths.map((s, i) => <li key={i}>{s}</li>)
            ) : (
              <p className="text-gray-500">No major strengths detected.</p>
            )}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-red-600">
            <XCircle /> Weaknesses
          </h3>
          <ul className="list-disc ml-6 text-gray-700">
            {weaknesses.length > 0 ? (
              weaknesses.map((w, i) => <li key={i}>{w}</li>)
            ) : (
              <p className="text-gray-500">No major weaknesses detected.</p>
            )}
          </ul>
        </div>

        {/* Detailed Answers */}
        <h3 className="text-2xl font-semibold mb-4">Detailed Evaluation</h3>

        <div className="space-y-8">
          {answers.map((ans, idx) => (
            <div
              key={idx}
              className="p-6 border rounded-xl bg-gray-50 shadow-md"
            >
              <h4 className="text-xl font-bold mb-2">
                Question {idx + 1}: {ans.question}
              </h4>

              <p className="text-gray-700 mb-4 italic">
                "{ans.answer || 'No transcript'}"
              </p>

              <div className="mb-4">
                <h5 className="font-semibold flex items-center gap-2">
                  <Star className="text-yellow-500" /> Score:
                </h5>
                <p className="text-purple-600 font-bold text-xl">{ans.score}/10</p>
              </div>

              {/* Audio */}
              {ans.audioUrl && (
                <audio
                  controls
                  className="w-full mt-2"
                  src={`http://localhost:5000${ans.audioUrl}`}
                ></audio>
              )}

              {/* Feedback */}
              <div className="mt-4">
                <h5 className="font-semibold">Feedback:</h5>
                <p className="text-gray-700">{ans.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
