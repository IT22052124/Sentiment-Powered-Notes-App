from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from transformers import pipeline
from database import SessionLocal, engine, Base
from models import Note
from pydantic import BaseModel


Base.metadata.create_all(bind=engine)
app = FastAPI(title="Sentiment-Powered Notes App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sentiment_model = pipeline("sentiment-analysis")

def get_db():
    db= SessionLocal()
    try:
        yield db
    finally:
        db.close()


class NoteCreate(BaseModel):
    text: str

@app.post("/notes/")
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    result = sentiment_model(note.text)[0]
    sentiment = f"{result['label']} ({round(result['score'], 2)})"

    new_note = Note(text=note.text, sentiment=sentiment)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@app.get("/notes/")
def read_notes(db: Session = Depends(get_db)):
    return db.query(Note).all()