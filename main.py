from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from transformers import pipeline
import os, requests
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import List
import hashlib

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MONGODB_URL = os.getenv("MONGODB_URL")

client = AsyncIOMotorClient(MONGODB_URL)
db = client.bujji_ai
users_collection = db.users
chats_collection = db.chats

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

@app.get("/")
async def serve_login():
    return FileResponse("login.html")

@app.get("/chat")
async def serve_chat():
    return FileResponse("index.html")

@app.get("/api/health")
async def health():
    return {"status": "ok", "groq_key_configured": bool(GROQ_API_KEY)}

nllb = pipeline("translation", model="facebook/nllb-200-distilled-600M")

class ChatRequest(BaseModel):
    message: str
    username: str

class TranslateRequest(BaseModel):
    text: str
    target_lang: str

class UserRequest(BaseModel):
    username: str
    password: str

class ChatHistory(BaseModel):
    username: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        if not GROQ_API_KEY:
            return JSONResponse(status_code=500, content={"error": "GROQ_API_KEY not configured"})
        
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": "You are Bujji, a friendly AI assistant. Use emojis and be helpful."},
                    {"role": "user", "content": req.message}
                ]
            },
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        ai_response = data["choices"][0]["message"]["content"]
        
        await chats_collection.insert_one({
            "username": req.username,
            "message": req.message,
            "response": ai_response,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return {"response": ai_response}
    except requests.exceptions.RequestException as e:
        error_detail = str(e)
        if hasattr(e.response, 'text'):
            error_detail += f" - {e.response.text}"
        print(f"API Error: {error_detail}")
        return JSONResponse(status_code=500, content={"error": error_detail})
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/translate")
async def translate(req: TranslateRequest):
    try:
        result = nllb(req.text, src_lang="eng_Latn", tgt_lang=req.target_lang)
        return JSONResponse({"translation": result[0]["translation_text"]})
    except Exception as e:
        return JSONResponse(status_code=500, content={"translation": f"❌ Error: {str(e)}"})

@app.post("/api/signup")
async def signup(user: UserRequest):
    if len(user.username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    existing = await users_collection.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    await users_collection.insert_one({
        "username": user.username,
        "password": hash_password(user.password),
        "created_at": datetime.utcnow().isoformat()
    })
    return {"message": "User created successfully"}

@app.post("/api/login")
async def login(user: UserRequest):
    existing = await users_collection.find_one({
        "username": user.username,
        "password": hash_password(user.password)
    })
    if not existing:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    return {"message": "Login successful", "username": user.username}

@app.post("/api/chat-history")
async def get_chat_history(req: ChatHistory):
    chats = await chats_collection.find({"username": req.username}).sort("timestamp", -1).to_list(50)
    return {"chats": [{"id": str(chat["_id"]), "message": chat["message"], "response": chat["response"], "timestamp": chat["timestamp"]} for chat in chats]}