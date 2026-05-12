from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("")
def insights() -> dict:
    return {"busiest_hour": None, "busiest_day": None, "seasonal_patterns": []}
