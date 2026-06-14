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

class PaymentGenerateRequest(BaseModel):
    user_account_id: str   # e.g., "0.0.123456"
    description: str        # optional: link to project

class PaymentGenerateResponse(BaseModel):
    transaction_bytes: str
    transaction_id: str
    amount_hbar: int
    recipient: str

class PaymentVerifyRequest(BaseModel):
    transaction_id: str
    description: str