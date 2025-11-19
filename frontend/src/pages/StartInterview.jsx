import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StartInterviewForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "HR",
    totalQuestions: 3
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleStart() {
    const res = await axios.post("http://localhost:5000/api/session/start", form);

    const sessionId = res.data.session._id;

    navigate(`/session/${sessionId}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        
        <h1 className="text-3xl font-bold mb-6 text-center">Start Your Mock Interview</h1>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Your Name"
            className="w-full p-3 border rounded"
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Your Email"
            className="w-full p-3 border rounded"
            onChange={handleChange}
          />

          <select 
            name="category" 
            className="w-full p-3 border rounded"
            onChange={handleChange}
          >
            <option value="HR">HR Round</option>
            <option value="Technical">Technical Round</option>
            <option value="Behavioral">Behavioral Round</option>
          </select>

          <input
            name="totalQuestions"
            type="number"
            min="1"
            className="w-full p-3 border rounded"
            placeholder="Number of Questions"
            onChange={handleChange}
          />

          <button
            onClick={handleStart}
            className="w-full py-3 mt-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}
