from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/best-time", tags=["best-time"])


@router.get("/{hospital_id}")
def best_time(hospital_id: str) -> dict:
    return {"hospital_id": hospital_id, "heatmap": []}
