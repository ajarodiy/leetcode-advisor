# ⚡ LeetCode AI Advisor Extension

An AI-powered Chrome Extension that enhances your LeetCode experience by tracking your problem-solving history, analyzing your strengths and weaknesses, and delivering personalized insights, hints, and solutions — all with zero effort.

---

## 🚀 Key Features

- 🧠 **Smart Suggestions**: Automatically generates personalized improvement insights using OpenAI GPT-4 based on your LeetCode history.
- 📈 **Real-time Progress Tracking**: Tracks problems you solve, the time taken, difficulty, and code submission.
- 💡 **Solution Guidance**: Detects suboptimal solutions and hints at cleaner ones (via AI feedback system).
- 🔁 **Auto-Refresh AI Insights**: Periodically checks your activity and updates suggestions every 2 hours if you’ve been actively solving.
- 🧠 **Secure, Private & Device-Consistent**: Stores your history and insights in Firestore, tied to your login.
- 🔐 **Firebase Auth Integration**: Simple sign-in/sign-up with token-based user tracking.

---

## 🛠️ Technologies Used

### 🧩 Frontend
- **React.js** + TypeScript
- **Tailwind CSS** for modern, responsive styling
- **Framer Motion** for slick animations
- **Chrome Extension APIs** for page access and script injection

### 🧠 Backend (AI + Data)
- **FastAPI** for serving APIs
- **Firestore (Firebase)** for storing:
  - Problem attempts
  - Insight records
  - User activity logs
- **OpenAI GPT-4 API** for smart suggestion generation
- **JWT Auth** using Firebase ID tokens

### 🧪 Dev & Tools
- Vite.js (frontend bundling)
- Chrome `scripting`, `storage`, and `tabs` APIs
- Deployment-ready structure

---

## ✨ Insight Generation Flow

1. You solve a problem on LeetCode.
2. The extension scrapes:
   - Problem name, difficulty
   - Code submitted
   - Time taken
3. This is sent to the FastAPI backend (`/submitAttempt/...`), which stores it in Firestore.
4. Every 5 minutes, your browser pings `/updateActivity` if you're on LeetCode.
5. Every 2 hours (if recently active), `/user-insights/...`:
   - Pulls your past problems
   - Feeds them to `generate_insights()` using OpenAI
   - Saves generated suggestions to Firestore
6. On the extension popup, you see your fresh "Smart Suggestions" instantly!

---

## ⚙️ Run Locally

### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend (React + Extension)
```bash
cd frontend
npm install
npm run build
```
Then load `frontend/dist/` as an unpacked extension from `chrome://extensions`

---

## 🌐 Live Demo

(Coming Soon) — or test by solving problems directly on [LeetCode](https://leetcode.com)

---

## 🧠 Sample Smart Suggestions

- *"You tend to struggle with graph traversal problems. Focus on BFS/DFS next."*
- *"You’ve spent more time than average on easy problems. Consider increasing difficulty."*
- *"Try to write more optimal solutions — some of your recent submissions had O(n²) alternatives."*

---

## 🔒 Auth & Privacy

- Login with Firebase Auth
- Your UID and token are stored only locally (in `chrome.storage`)
- Insights and problem history are synced to your account only

---

## 🎯 Future Improvements

- Real-time hints while typing
- Code quality feedback via static analysis + LLMs
- AI-curated practice playlists
- Language-aware solution complexity analysis

---

## 📜 License

MIT

---

## 🤝 Contributions

Want to improve the insights engine? Have a better UI idea?
Feel free to open issues or PRs!