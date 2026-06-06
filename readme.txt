# Lab Record AI

AI-powered laboratory record generation platform for engineering and science students.

## Features

- Experiment validation
- AI-powered spelling correction
- Academic domain detection
- Smart section recommendations
- Structured record generation
- Document preview
- Editable documents
- DOCX export
- Groq primary AI provider
- Gemini fallback provider

## Workflow

Course Name
→ Experiment Name
→ Validation
→ Domain Detection
→ Section Recommendation
→ Generation
→ Document Preview
→ Editing
→ DOCX Export

## Tech Stack

Frontend:
- HTML
- CSS
- JavaScript

Backend:
- FastAPI

AI:
- Groq
- Gemini

Document Export:
- python-docx

## Setup

1. Clone repository

2. Install dependencies

pip install -r requirements.txt

3. Create .env

4. Add API keys

5. Start server

uvicorn main:app --reload

6. Open browser

http://localhost:8000

## License

MIT