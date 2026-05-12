from __future__ import annotations

from collections.abc import Iterator

import psycopg
from psycopg.rows import dict_row

from api.config import settings


def database_url() -> str:
    return settings.database_url.replace("postgresql+psycopg://", "postgresql://")


def get_conn() -> Iterator[psycopg.Connection]:
    with psycopg.connect(database_url(), row_factory=dict_row) as conn:
        yield conn
