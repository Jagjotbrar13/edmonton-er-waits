from __future__ import annotations

from fastapi import APIRouter, Depends
from psycopg import Connection

from api.database import get_conn

router = APIRouter(prefix="/hospitals", tags=["hospitals"])


@router.get("")
def list_hospitals(conn: Connection = Depends(get_conn)) -> list[dict]:
    rows = conn.execute(
        """
        SELECT h.*, ws.wait_minutes, ws.patients_waiting, ws.scraped_at
        FROM hospitals h
        LEFT JOIN LATERAL (
            SELECT wait_minutes, patients_waiting, scraped_at
            FROM wait_snapshots
            WHERE hospital_id = h.id
            ORDER BY scraped_at DESC
            LIMIT 1
        ) ws ON TRUE
        ORDER BY h.name
        """
    ).fetchall()
    return list(rows)


@router.get("/{hospital_id}")
def get_hospital(hospital_id: str, conn: Connection = Depends(get_conn)) -> dict:
    row = conn.execute("SELECT * FROM hospitals WHERE id = %s", (hospital_id,)).fetchone()
    return dict(row) if row else {}


@router.get("/{hospital_id}/history")
def get_hospital_history(hospital_id: str, conn: Connection = Depends(get_conn)) -> list[dict]:
    rows = conn.execute(
        """
        SELECT wait_minutes, patients_waiting, scraped_at
        FROM wait_snapshots
        WHERE hospital_id = %s
        ORDER BY scraped_at DESC
        LIMIT 336
        """,
        (hospital_id,),
    ).fetchall()
    return list(rows)
