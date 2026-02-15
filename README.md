# Bujji AI – Your Smart, Friendly AI Assistant 🌟

Bujji AI is a powerful, voice-enabled, multilingual personal assistant built with **FastAPI + JavaScript**. Designed with a modern UI and natural interaction, Bujji is here to assist you in the most human-like way possible.

---

## 🚀 Features

✅ Simple signup & Login (MongoDB Atlas)
✅ Chat History Sidebar
✅ UI language change mode (11 languages)
✅ AI Chat powered by Groq API
✅ Voice-Enabled Input & Output
✅ Language Translation (20+ languages via NLLB)
✅ Light/Dark Theme Toggle
✅ Fully Responsive UI

---

## 🛠️ Built With

- **FastAPI** – Lightweight backend framework
- **JavaScript** – Real-time interaction
- **HTML + CSS** – Clean and modern interface
- **SpeechRecognition API** – Voice input
- **SpeechSynthesis** – Voice response
- **Groq API** – AI chat completions
- **Transformers (NLLB)** – Translation model
- **LocalStorage** – Login history

---

## 📦 Local Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/praneethkumar1129/bujji_ai.git
cd bujji_ai

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup MongoDB Atlas
# - Create a free account at https://www.mongodb.com/cloud/atlas
# - Create a new cluster
# - Get your connection string

# 5. Configure .env file
# Create .env file and add:
# GROQ_API_KEY=your_groq_key_here
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/bujji_ai

# 6. Run the app
uvicorn main:app --reload
# Or simply run: start.bat (Windows)
```

Then open your browser and go to:
**http://127.0.0.1:8000**

---

## 📢 Feedback & Contact

If you liked Bujji or have feedback to share, feel free to connect!

**Created by:** Praneeth Kumar
