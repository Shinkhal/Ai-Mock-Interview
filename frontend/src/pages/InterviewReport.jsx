import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  CheckCircle, 
  XCircle, 
  Star, 
  TrendingUp, 
  Award, 
  Volume2,
  Home,
  Download,
  Share2,
  Sparkles
} from "lucide-react";

export default function InterviewReport() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
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
  }, [sessionId]);

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 8) return "from-green-100 to-emerald-100 border-green-200";
    if (score >= 6) return "from-yellow-100 to-amber-100 border-yellow-200";
    return "from-red-100 to-pink-100 border-red-200";
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Fair";
    return "Needs Improvement";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-xl border-2 border-purple-200">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-semibold text-gray-900">Generating your report...</p>
            <p className="text-sm text-gray-600">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-red-200 max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-center text-gray-900">Error loading report</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const { overallScore, strengths, weaknesses, report: answers } = report;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b-2 border-purple-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Interview Report</h2>
                <p className="text-sm text-gray-600">Session ID: {sessionId?.slice(0, 8)}...</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 text-purple-600 hover:text-purple-700 transition flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Celebration Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 mb-8 text-white text-center shadow-xl">
          <Sparkles className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            🎉 Interview Complete!
          </h1>
          <p className="text-purple-100 text-lg">
            Great job! Here's your detailed performance report
          </p>
        </div>

        {/* Overall Score Card */}
        <div className={`bg-gradient-to-br ${getScoreBgColor(overallScore)} rounded-2xl p-8 mb-8 border-2 shadow-xl`}>
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/50 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Overall Performance</span>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className={`text-7xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </div>
              <div className="text-left">
                <div className="text-4xl font-bold text-gray-700">/10</div>
                <div className={`text-lg font-semibold ${getScoreColor(overallScore)}`}>
                  {getScoreLabel(overallScore)}
                </div>
              </div>
            </div>

            {/* Score Stars */}
            <div className="flex justify-center space-x-1">
              {[...Array(10)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < overallScore
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* Strengths Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
            </div>
            
            {strengths.length > 0 ? (
              <ul className="space-y-3">
                {strengths.map((s, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No major strengths identified yet.</p>
            )}
          </div>

          {/* Weaknesses Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-red-200 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Areas to Improve</h3>
            </div>
            
            {weaknesses.length > 0 ? (
              <ul className="space-y-3">
                {weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{w}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No major weaknesses identified.</p>
            )}
          </div>
        </div>

        {/* Detailed Answers Section */}
        <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Sparkles className="w-7 h-7 text-purple-500" />
            <span>Detailed Evaluation</span>
          </h3>

          <div className="space-y-6">
            {answers.map((ans, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="text-lg font-bold text-gray-900">
                        {ans.question}
                      </h4>
                    </div>
                  </div>
                  
                  {/* Score Badge */}
                  <div className={`${getScoreBgColor(ans.score)} border-2 px-4 py-2 rounded-xl text-center min-w-[80px]`}>
                    <div className={`text-2xl font-bold ${getScoreColor(ans.score)}`}>
                      {ans.score}
                    </div>
                    <div className="text-xs text-gray-600">/ 10</div>
                  </div>
                </div>

                {/* Answer Transcript */}
                <div className="bg-white/70 p-4 rounded-lg mb-4 border border-purple-200">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Your Answer:</h5>
                  <p className="text-gray-700 italic">
                    "{ans.answer || 'No transcript available'}"
                  </p>
                </div>

                {/* Audio Player */}
                {ans.audioUrl && (
                  <div className="bg-white/70 p-4 rounded-lg mb-4 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <Volume2 className="w-5 h-5 text-purple-600" />
                      <h5 className="text-sm font-semibold text-gray-700">Audio Recording:</h5>
                    </div>
                    <audio
                      controls
                      className="w-full"
                      src={`http://localhost:5000${ans.audioUrl}`}
                    ></audio>
                  </div>
                )}

                {/* Feedback */}
                <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>AI Feedback:</span>
                  </h5>
                  <p className="text-gray-700 leading-relaxed">{ans.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Start New Interview</span>
          </button>
          
          <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition border-2 border-purple-200 shadow-lg flex items-center justify-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Share Results</span>
          </button>
        </div>
      </div>
    </div>
  );
}