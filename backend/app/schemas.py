from pydantic import BaseModel
from typing import List


class ProjectInput(BaseModel):
    description: str


class AssessmentResponse(BaseModel):
    project_type: str
    methodology: str
    confidence: int
    readiness_score: int
    risks: List[str]
    analysis: str