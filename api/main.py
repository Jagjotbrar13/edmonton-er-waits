from __future__ import annotations

from fastapi import FastAPI

from api.config import settings
from api.routes import best_time, compare, hospitals, insights, predictions

app = FastAPI(title=settings.api_title)

app.include_router(hospitals.router)
app.include_router(predictions.router)
app.include_router(best_time.router)
app.include_router(compare.router)
app.include_router(insights.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
