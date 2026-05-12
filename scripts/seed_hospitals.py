from __future__ import annotations

from pathlib import Path
import os

import psycopg
from dotenv import load_dotenv


def database_url() -> str:
    load_dotenv(override=True)
    url = os.environ.get("DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:55432/er_wait")
    return url.replace("postgresql+psycopg://", "postgresql://")


def main() -> None:
    sql = Path("db/seed/hospitals.sql").read_text()
    with psycopg.connect(database_url()) as conn:
        conn.execute(sql)
    print("Seeded hospitals")


if __name__ == "__main__":
    main()
