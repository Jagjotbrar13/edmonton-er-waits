from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from psycopg import Connection

from api.database import get_conn

router = APIRouter(prefix="/hospitals", tags=["hospitals"])


@router.get("")
def list_hospitals(conn: Connection = Depends(get_conn)) -> list[dict]:
    rows = conn.execute(
        """
        SELECT
            h.*,
            ws.wait_minutes,
            ws.patients_waiting,
            ws.scraped_at,
            prev.wait_minutes AS previous_wait_minutes,
            recent.recent_waits
        FROM hospitals h
        LEFT JOIN LATERAL (
            SELECT wait_minutes, patients_waiting, scraped_at
            FROM wait_snapshots
            WHERE hospital_id = h.id
            ORDER BY scraped_at DESC
            LIMIT 1
        ) ws ON TRUE
        LEFT JOIN LATERAL (
            SELECT wait_minutes
            FROM wait_snapshots
            WHERE hospital_id = h.id
            ORDER BY scraped_at DESC
            OFFSET 1
            LIMIT 1
        ) prev ON TRUE
        LEFT JOIN LATERAL (
            SELECT ARRAY_AGG(wait_minutes ORDER BY scraped_at ASC) AS recent_waits
            FROM (
                SELECT wait_minutes, scraped_at
                FROM wait_snapshots
                WHERE hospital_id = h.id
                ORDER BY scraped_at DESC
                LIMIT 12
            ) latest
        ) recent ON TRUE
        ORDER BY h.name
        """
    ).fetchall()
    return list(rows)


@router.get("/{hospital_id}")
def get_hospital(hospital_id: str, conn: Connection = Depends(get_conn)) -> dict:
    row = conn.execute(
        """
        SELECT
            h.*,
            ws.wait_minutes,
            ws.patients_waiting,
            ws.scraped_at,
            prev.wait_minutes AS previous_wait_minutes,
            recent.recent_waits
        FROM hospitals h
        LEFT JOIN LATERAL (
            SELECT wait_minutes, patients_waiting, scraped_at
            FROM wait_snapshots
            WHERE hospital_id = h.id
            ORDER BY scraped_at DESC
            LIMIT 1
        ) ws ON TRUE
        LEFT JOIN LATERAL (
            SELECT wait_minutes
            FROM wait_snapshots
            WHERE hospital_id = h.id
            ORDER BY scraped_at DESC
            OFFSET 1
            LIMIT 1
        ) prev ON TRUE
        LEFT JOIN LATERAL (
            SELECT ARRAY_AGG(wait_minutes ORDER BY scraped_at ASC) AS recent_waits
            FROM (
                SELECT wait_minutes, scraped_at
                FROM wait_snapshots
                WHERE hospital_id = h.id
                ORDER BY scraped_at DESC
                LIMIT 12
            ) latest
        ) recent ON TRUE
        WHERE h.id = %s
        """,
        (hospital_id,),
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return dict(row)


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
