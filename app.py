from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from functions import extract_highlights

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

