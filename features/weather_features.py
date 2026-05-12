from __future__ import annotations

import pandas as pd


def add_weather_features(snapshots: pd.DataFrame, weather: pd.DataFrame) -> pd.DataFrame:
    return pd.merge_asof(
        snapshots.sort_values("scraped_at"),
        weather.sort_values("recorded_at"),
        left_on="scraped_at",
        right_on="recorded_at",
        tolerance=pd.Timedelta("1h"),
        direction="nearest",
    )
