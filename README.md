#Sentiment-Powered Notes App
A FastAPI application that allows you to store notes in PostgreSQL and analyze their sentiment using a Hugging Face model.
Overview
Stores notes with text and sentiment. Provides a simple REST API with full CRUD support (POST and GET included). The sentiment model currently supports Positive / Negative labels (can be upgraded to 3-class).
Features

Create notes with automatic sentiment analysis.
Retrieve all stored notes with their sentiment.
Easy to run locally using Docker for PostgreSQL.
Uses FastAPI Swagger UI for testing API endpoints.

Tech Stack

Backend: FastAPI
Database: PostgreSQL
ORM: SQLAlchemy
NLP: Hugging Face Transformers (distilbert-base-uncased-finetuned-sst-2-english)
Python Version: 3.11+
