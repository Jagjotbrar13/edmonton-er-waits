from __future__ import annotations

from fastapi import APIRouter, Depends
from psycopg import Connection

from api.database import get_conn

router = APIRouter(prefix="/compare", tags=["compare"])


@router.get("")
def compare(conn: Connection = Depends(get_conn)) -> list[dict]:
    rows = conn.execute(
        """
        SELECT
            h.id,
            h.name,
            h.city,
            ws.wait_minutes,
            ws.patients_waiting,
            ws.scraped_at,
            prev.wait_minutes AS previous_wait_minutes
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
        ORDER BY ws.wait_minutes NULLS LAST, h.name
        """
    ).fetchall()
    return list(rows)
