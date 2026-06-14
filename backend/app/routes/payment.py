from fastapi import APIRouter
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from app.agent.premium_report import generate_premium_report

load_dotenv()
router = APIRouter(prefix="/payment", tags=["payment"])

SERVICE_ACCOUNT_ID = os.getenv("SERVICE_ACCOUNT_ID")  # Your receiving account ID

class VerifyRequest(BaseModel):
    transaction_id: str
    description: str

class VerifyResponse(BaseModel):
    success: bool
    report: str | None = None
    error: str | None = None

@router.post("/verify", response_model=VerifyResponse)
async def verify_payment(req: VerifyRequest):
    mirror_url = f"https://testnet.mirrornode.hedera.com/api/v1/transactions/{req.transaction_id}"
    try:
        resp = requests.get(mirror_url, timeout=10)
        if resp.status_code != 200:
            return VerifyResponse(success=False, error="Transaction not found on mirror node")
        
        data = resp.json()
        # Check if our service account received exactly 8 HBAR (80,000,000 tinybars)
        for transfer in data.get("transfers", []):
            if transfer["account"] == SERVICE_ACCOUNT_ID and transfer["amount"] == 80000000:
                report = generate_premium_report(req.description)
                return VerifyResponse(success=True, report=report)
        
        return VerifyResponse(success=False, error="Payment amount incorrect or not received")
    except Exception as e:
        return VerifyResponse(success=False, error=str(e))