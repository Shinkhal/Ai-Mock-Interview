# AI Mock Interview Platform

A complete MERN-stack AI-powered mock interview system featuring:

* 🎤 **AI Interviewer Avatar**
* 🔊 **Text‑to‑Speech question delivery**
* 🎙️ **Real‑time audio recording**
* 🧠 **Automated interview evaluation**
* 📊 **Final report with scoring**
* 🛠️ **Admin question management**
* ⚡ **WebSocket‑based live interview flow**

This project recreates a realistic interview experience where an AI avatar asks questions, listens to the candidate, evaluates their answers, and generates a detailed report.

---

## 🚀 Features

### 🎭 AI Interviewer Avatar

* Animated avatar reacts while speaking.
* Smooth UI using **React + Tailwind**.

### 🔊 Text‑to‑Speech (TTS)

* Questions are spoken aloud using browser TTS.
* No external paid tools required.

### 🎙️ Real‑Time Audio Recording

* Uses **MediaRecorder API**.
* Sends audio chunks to backend via **Socket.io**.
* Fully asynchronous interview flow.

### 🧠 Automated Evaluation Engine

* NLP‑based scoring using:

  * Keyword matching
  * Transcript analysis
  * Strength/weakness detection
* Generates per‑question and overall score.

### 📄 Final Report Page

* Detailed score breakdown
* Feedback per question
* Strength & Weakness summary
* Integrated audio playback

### ⚙️ Admin Dashboard (Upcoming)

* Add/Edit/Delete Questions
* Categorize rounds (HR, Tech, Behavioral)
* Select total questions per interview session

---

## 🛠 Tech Stack

### **Frontend**

* React (Vite)
* Tailwind CSS
* Socket.io Client
* Lucide Icons

### **Backend**

* Node.js + Express
* MongoDB + Mongoose
* Socket.io
* Speech‑to‑Text API support (Deepgram/AssemblyAI optional integration)
* Multer for audio storage

### **Other Tools**

* Web Speech API (TTS)
* MediaRecorder API

---

## 📦 Installation

Clone the repository:

```bash
https://github.com/Shinkhal/Ai-Mock-Interview.git
cd Ai-Mock-Interview
```

### 🔧 Backend Setup

```bash
cd backend
npm install
npm start
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## ▶️ How It Works

### 1️⃣ User arrives at landing page

`/` → Beautiful UI with product overview.

### 2️⃣ Starts the interview

`/start` → Candidate enters:

* Name
* Email
* Category
* No. of questions

Session is created via backend.

### 3️⃣ Interview page loads

* Avatar greets the user
* Reads the first question
* Timer starts when user clicks "Start Answering"
* User audio is recorded & streamed to backend

### 4️⃣ Each answer saved

* Backend stores audio + transcript
* Generates score & feedback

### 5️⃣ Final Report generated

`/report/:sessionId` shows:

* Overall Score
* Strengths
* Weaknesses
* Transcript
* Audio playback
* Per‑question evaluation

---

## 📂 Project Structure

```
Ai-Mock-Interview/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│
└── README.md
```

---

## 🔌 API Endpoints

### 🎯 **Session Routes**

| Method | Endpoint                       | Description              |
| ------ | ------------------------------ | ------------------------ |
| POST   | `/api/session/start`           | Start interview session  |
| GET    | `/api/session/:id/next`        | Get next question        |
| POST   | `/api/session/:id/answer/:qid` | Upload full audio answer |
| POST   | `/api/session/:id/finish`      | Generate final report    |

### 🎤 **WebSocket Events**

| Event                   | From               | Description            |
| ----------------------- | ------------------ | ---------------------- |
| `join-session`          | frontend → backend | Join interview room    |
| `request-next-question` | frontend → backend | Request next question  |
| `question`              | backend → frontend | Send question object   |
| `start-recording`       | frontend → backend | Start answer recording |
| `audio-chunk`           | frontend → backend | Stream voice data      |
| `stop-recording`        | frontend → backend | Stop & finalize answer |
| `answer-saved`          | backend → frontend | Notify UI              |

---

## 📈 Future Enhancements

* Live transcription (speech‑to‑text in real‑time)
* Detailed NLP scoring (semantic similarity)
* Admin login & dashboard
* Email delivery with report
* AI‑generated follow‑up questions
* Avatar lip‑sync animation

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

