from fastapi import FastAPI

from functions import extract_highlights

app = FastAPI()

@app.get("/highlights")
def get_highlights(file_path: str):
    highlights = extract_highlights(file_path)
    return highlights

