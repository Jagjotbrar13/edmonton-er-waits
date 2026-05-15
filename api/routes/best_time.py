from __future__ import annotations

from fastapi import APIRouter, Depends
from psycopg import Connection

from api.database import get_conn

router = APIRouter(prefix="/best-time", tags=["best-time"])


@router.get("/{hospital_id}")
def best_time(hospital_id: str, conn: Connection = Depends(get_conn)) -> dict:
    exact_rows = conn.execute(
        """
        SELECT
            MOD(EXTRACT(DOW FROM scraped_at AT TIME ZONE 'America/Edmonton')::int + 6, 7) AS day_index,
            (FLOOR(EXTRACT(HOUR FROM scraped_at AT TIME ZONE 'America/Edmonton') / 4) * 4)::int AS hour_bucket,
            ROUND(AVG(wait_minutes))::int AS average_wait,
            COUNT(*)::int AS samples
        FROM wait_snapshots
        WHERE hospital_id = %s
        GROUP BY day_index, hour_bucket
        ORDER BY day_index, hour_bucket
        """,
        (hospital_id,),
    ).fetchall()

    hour_rows = conn.execute(
        """
        SELECT
            (FLOOR(EXTRACT(HOUR FROM scraped_at AT TIME ZONE 'America/Edmonton') / 4) * 4)::int AS hour_bucket,
            ROUND(AVG(wait_minutes))::int AS average_wait,
            COUNT(*)::int AS samples
        FROM wait_snapshots
        WHERE hospital_id = %s
        GROUP BY hour_bucket
        """,
        (hospital_id,),
    ).fetchall()

    overall = conn.execute(
        """
        SELECT ROUND(AVG(wait_minutes))::int AS average_wait, COUNT(*)::int AS samples
        FROM wait_snapshots
        WHERE hospital_id = %s
        """,
        (hospital_id,),
    ).fetchone()

    exact = {(row["day_index"], row["hour_bucket"]): dict(row) for row in exact_rows}
    observed_days = {row["day_index"] for row in exact_rows}
    hourly = {row["hour_bucket"]: dict(row) for row in hour_rows}
    fallback_wait = overall["average_wait"] if overall else None
    fallback_samples = overall["samples"] if overall else 0

    heatmap = []
    for day_index in range(7):
        for hour_bucket in [0, 4, 8, 12, 16, 20]:
            if day_index not in observed_days:
                cell = {
                    "day_index": day_index,
                    "hour_bucket": hour_bucket,
                    "average_wait": None,
                    "samples": 0,
                }
                source = "no_data"
            elif (day_index, hour_bucket) in exact:
                cell = exact[(day_index, hour_bucket)]
                source = "exact"
            elif hour_bucket in hourly:
                cell = {
                    "day_index": day_index,
                    "hour_bucket": hour_bucket,
                    "average_wait": hourly[hour_bucket]["average_wait"],
                    "samples": hourly[hour_bucket]["samples"],
                }
                source = "hour_fallback"
            else:
                cell = {
                    "day_index": day_index,
                    "hour_bucket": hour_bucket,
                    "average_wait": fallback_wait,
                    "samples": fallback_samples,
                }
                source = "overall_fallback"

            cell["source"] = source
            heatmap.append(cell)

    return {"hospital_id": hospital_id, "heatmap": heatmap}
