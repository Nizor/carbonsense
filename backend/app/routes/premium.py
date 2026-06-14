from fastapi import APIRouter
from pydantic import BaseModel

from app.agent.premium_report import (
    generate_premium_report
)

router = APIRouter()


class PremiumRequest(BaseModel):
    description: str
    transaction_id: str


router = APIRouter()


@router.post("/premium-report")
def premium_report(data: PremiumRequest):

    # TEMPORARY HACKATHON SHORTCUT
    # Allows testing without real HBAR payment
    if data.transaction_id == "demo":
        verified = True
    else:
        verified = False

    if not verified:
        return {
            "success": False,
            "message":
            "Payment verification failed."
        }

    report = generate_premium_report(
        data.description
    )

    return {
        "success": True,
        "report": report
    }