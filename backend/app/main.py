from fastapi import FastAPI
from app.routes.assessment import router

app = FastAPI(
    title="CarbonSense AI"
)

app.include_router(router)