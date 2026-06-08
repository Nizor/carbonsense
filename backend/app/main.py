from fastapi import FastAPI
from app.routes.assessment import (
    router as assessment_router
)

from app.routes.premium import (
    router as premium_router
)

app = FastAPI(
    title="CarbonSense AI"
)

app.include_router(assessment_router)
app.include_router(premium_router)