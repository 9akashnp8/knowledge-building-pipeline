from typing import List
from pydantic import BaseModel

class HighlightsPayload(BaseModel):
    selected_highlights:  List["str"]
