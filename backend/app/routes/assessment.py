from fastapi import APIRouter
from app.schemas import (
    ProjectInput,
    AssessmentResponse
)

from app.agent.carbon_agent import assess_project

router = APIRouter()


@router.post(
    "/assess",
    response_model=AssessmentResponse
)
def assess(data: ProjectInput):
    result = assess_project(data.description)
    return result