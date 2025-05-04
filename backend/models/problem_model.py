from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AttemptData(BaseModel):
    timestamp: Optional[datetime]
    lang: str
    timeTaken: float
    verdict: str
    usedHint: bool
    isOptimal: bool
    code: str

class ProblemSubmitRequest(BaseModel):
    title: str
    tags: List[str]
    avgTime: float
    attempt: AttemptData