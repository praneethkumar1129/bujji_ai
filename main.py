# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from transformers import pipeline
import os, requests
import databases
import sqlalchemy

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Database setup
DATABASE_URL = "sqlite:///./test.db"
database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

# Define tables
users = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("username", sqlalchemy.String, unique=True),
    sqlalchemy.Column("password", sqlalchemy.String),
)

chat_history = sqlalchemy.Table(
    "chat_history",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("username", sqlalchemy.String),
    sqlalchemy.Column("message", sqlalchemy.String),
)

# Create the database
engine = sqlalchemy.create_engine(DATABASE_URL)
metadata.create_all(engine)

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/")
async def serve_login():
    return FileResponse("login.html")

@app.get("/chat")
async def serve_chat():
    return FileResponse("index.html")

# Chat and translation models
nllb = pipeline("translation", model="facebook/nllb-200-distilled-600M")
NLLB_LANGS = {
    "Spanish": "spa_Latn", "French": "fra_Latn", "German": "deu_Latn",
    "Italian": "ita_Latn", "Portuguese": "por_Latn", "Russian": "rus_Cyrl",
    "Chinese": "zho_Hans", "Japanese": "jpn_Jpan", "Korean": "kor_Hang",
    "Arabic": "arb_Arab", "Hindi": "hin_Deva", "Telugu": "tel_Telu",
    "Tamil": "tam_Taml", "Kannada": "kan_Knda", "Malayalam": "mal_Mlym",
    "Bengali": "ben_Beng", "Gujarati": "guj_Gujr", "Punjabi": "pan_Guru",
    "Urdu": "urd_Arab", "Turkish": "tur_Latn", "English": "eng_Latn"
}

# Models
class ChatRequest(BaseModel):
    message: str
    username: str
    target_lang: str = "English"

class TranslateRequest(BaseModel):
    text: str
    target_lang: str

class UserRequest(BaseModel):
    username: str
    password: str

# API endpoints
@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        await database.execute(chat_history.insert().values(username=req.username, message=req.message))

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-8b-8192",
                "messages": [
                    {"role": "system", "content": "You are Bujji, a friendly AI assistant. Use emojis, structured format."},
                    {"role": "user", "content": req.message}
                ]
            }
        )
        return JSONResponse({"response": response.json()["choices"][0]["message"]["content"]})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/translate")
async def translate(req: TranslateRequest):
    try:
        # Accept target_lang directly as the code like tel_Telu
        result = nllb(req.text, src_lang="eng_Latn", tgt_lang=req.target_lang)
        return JSONResponse({"translation": result[0]["translation_text"]})
    except Exception as e:
        return JSONResponse(status_code=500, content={"translation": f"❌ Error: {str(e)}"})



@app.post("/api/signup")
async def signup(user: UserRequest):
    query = users.insert().values(username=user.username, password=user.password)
    await database.execute(query)
    return JSONResponse({"message": "User created successfully!"})

@app.post("/api/login")
async def login(user: UserRequest):
    query = users.select().where(users.c.username == user.username)
    existing_user = await database.fetch_one(query)
    if existing_user and existing_user['password'] == user.password:
        return JSONResponse({"message": "Login successful!"})
    raise HTTPException(status_code=400, detail="Invalid credentials")