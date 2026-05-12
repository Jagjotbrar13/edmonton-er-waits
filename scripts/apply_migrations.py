from __future__ import annotations

import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv


def database_url() -> str:
    load_dotenv(override=True)
    url = os.environ.get("DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:55432/er_wait")
    return url.replace("postgresql+psycopg://", "postgresql://")


def main() -> None:
    with psycopg.connect(database_url()) as conn:
        for path in sorted(Path("db/migrations").glob("*.sql")):
            conn.execute(path.read_text())
            print(f"Applied {path}")


if __name__ == "__main__":
    main()
