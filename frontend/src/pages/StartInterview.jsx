import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Sparkles, User, Mail, Layers, Hash, ArrowRight, CheckCircle } from "lucide-react";

export default function StartInterviewForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "HR",
    totalQuestions: 3
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleStart() {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/session/start", form);
      const sessionId = res.data.session._id;
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error("Error starting interview:", error);
      setLoading(false);
    }
  }

  const categories = [
    { value: "HR", label: "HR Round", icon: "👤" },
    { value: "Technical", label: "Technical Round", icon: "💻" },
    { value: "Behavioral", label: "Behavioral Round", icon: "🧠" }
  ];

  const benefits = [
    "AI-powered adaptive questions",
    "Real-time performance tracking",
    "Instant feedback & suggestions"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-purple-100 rounded-full border border-purple-200">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 text-sm font-medium">AI-Powered Practice</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Start Your Mock Interview
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get personalized interview practice with our AI. Build confidence and improve your skills.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Form Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Let's Get Started</h2>
            
            <div className="space-y-5">
              
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="name"
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                    onChange={handleChange}
                    value={form.name}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                    onChange={handleChange}
                    value={form.email}
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Type
                </label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select 
                    name="category" 
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition appearance-none bg-white cursor-pointer"
                    onChange={handleChange}
                    value={form.category}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Questions Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="totalQuestions"
                    type="number"
                    min="1"
                    max="20"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                    placeholder="3"
                    onChange={handleChange}
                    value={form.totalQuestions}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Recommended: 3-5 questions</p>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStart}
                disabled={loading || !form.name || !form.email}
                className="group w-full py-4 mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Starting...</span>
                  </>
                ) : (
                  <>
                    <span>Start Interview</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            
            {/* Benefits Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                <span>What You'll Get</span>
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Interview Tips</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Find a quiet place with good lighting</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Have your resume handy for reference</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Speak clearly and take your time to think</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Use the STAR method for behavioral questions</span>
                </li>
              </ul>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl text-center border-2 border-purple-200">
                <div className="text-2xl font-bold text-purple-600">10K+</div>
                <div className="text-xs text-gray-600">Interviews</div>
              </div>
              <div className="bg-white p-4 rounded-xl text-center border-2 border-purple-200">
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </div>
              <div className="bg-white p-4 rounded-xl text-center border-2 border-purple-200">
                <div className="text-2xl font-bold text-purple-600">4.9⭐</div>
                <div className="text-xs text-gray-600">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}