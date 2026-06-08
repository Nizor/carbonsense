from fastapi import APIRouter
from pydantic import BaseModel
from app.agent.premium_report import (
    generate_premium_report
)

router = APIRouter()


class PremiumRequest(BaseModel):
    description: str
    paid: bool = False


@router.post("/premium-report")
def premium_report(data: PremiumRequest):

    if not data.paid:
        return {
            "success": False,
            "message":
            "Premium report locked. Pay 8 HBAR to unlock."
        }

    report = generate_premium_report(
        data.description
    )

    return {
        "success": True,
        "report": report
    }