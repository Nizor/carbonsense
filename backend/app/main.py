from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.assessment import (
    router as assessment_router
)

from app.routes.premium import (
    router as premium_router
)

app = FastAPI(
    title="CarbonSense AI"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    assessment_router
)

app.include_router(
    premium_router
)