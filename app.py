from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware

from functions import extract_highlights
from models import HighlightsPayload
from constants import PROMPT

app = FastAPI()
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

@app.get("/highlights")
def get_highlights(file_path: str):
    highlights = extract_highlights(file_path)
    return highlights


@app.post("/generate-prompt")
def generate_prompt(payload: HighlightsPayload):
    highlights = payload.selected_highlights
    populated_prompt = PROMPT.format(content='\\n'.join(highlights))
    return PlainTextResponse(populated_prompt)
