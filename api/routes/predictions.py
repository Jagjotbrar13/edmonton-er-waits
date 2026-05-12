from __future__ import annotations

from fastapi import APIRouter, Depends
from psycopg import Connection

from api.database import get_conn

router = APIRouter(prefix="/hospitals/{hospital_id}/predictions", tags=["predictions"])


@router.get("")
def get_predictions(hospital_id: str, conn: Connection = Depends(get_conn)) -> list[dict]:
    rows = conn.execute(
        """
        SELECT horizon_hours, predicted_wait, lower_bound, upper_bound, target_time, model_version
        FROM predictions
        WHERE hospital_id = %s
        ORDER BY predicted_at DESC
        LIMIT 2
        """,
        (hospital_id,),
    ).fetchall()
    return list(rows)
