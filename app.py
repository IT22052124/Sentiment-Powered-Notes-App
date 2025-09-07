from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from transformers import pipeline
from database import SessionLocal, engine, Base
from models import Note



Base.metadata.create_all(bind=engine)
app = FastAPI(title="Sentiment-Powered Notes App")

sentiment_model = pipeline("sentiment-analysis")

def get_db():
    db= SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/notes/")
def create_note(text: str, db: Session = Depends(get_db)):
    result = sentiment_model(text)[0]
    sentiment = f"{result['label']} ({round(result['score'], 2)})"

    note = Note(text=text, sentiment=sentiment)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@app.get("/notes/")
def read_notes(db: Session = Depends(get_db)):
    return db.query(Note).all()