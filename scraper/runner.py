from __future__ import annotations

import os

import psycopg
from dotenv import load_dotenv

from scraper.ahs import fetch_wait_times
from scraper.weather import fetch_weather


def upsert_hospital(conn: psycopg.Connection, snapshot) -> str:
    row = conn.execute(
        """
        INSERT INTO hospitals (name, city, address, latitude, longitude, type)
        VALUES (%s, 'Edmonton', %s, %s, %s, 'major')
        ON CONFLICT (name) DO UPDATE
        SET address = COALESCE(EXCLUDED.address, hospitals.address),
            latitude = COALESCE(EXCLUDED.latitude, hospitals.latitude),
            longitude = COALESCE(EXCLUDED.longitude, hospitals.longitude)
        RETURNING id
        """,
        (snapshot.hospital_name, snapshot.address, snapshot.latitude, snapshot.longitude),
    ).fetchone()
    return str(row[0])


def insert_wait_snapshot(conn: psycopg.Connection, hospital_id: str, wait_minutes: int, patients_waiting: int | None) -> None:
    conn.execute(
        """
        INSERT INTO wait_snapshots (hospital_id, wait_minutes, patients_waiting)
        VALUES (%s, %s, %s)
        """,
        (hospital_id, wait_minutes, patients_waiting),
    )


def insert_weather_snapshot(conn: psycopg.Connection) -> None:
    weather = fetch_weather()
    conn.execute(
        """
        INSERT INTO weather_snapshots (city, temperature_c, precipitation_mm, wind_kph, condition)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (weather.city, weather.temperature_c, weather.precipitation_mm, weather.wind_kph, weather.condition),
    )


def main() -> None:
    load_dotenv(override=True)
    database_url = os.environ["DATABASE_URL"].replace("postgresql+psycopg://", "postgresql://")

    wait_times = fetch_wait_times()
    with psycopg.connect(database_url) as conn:
        for snapshot in wait_times:
            hospital_id = upsert_hospital(conn, snapshot)
            insert_wait_snapshot(
                conn,
                hospital_id,
                snapshot.wait_minutes,
                snapshot.patients_waiting,
            )
        insert_weather_snapshot(conn)

    print(f"Inserted {len(wait_times)} wait time snapshots")


if __name__ == "__main__":
    main()
