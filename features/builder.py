from __future__ import annotations

import pandas as pd

from features.holiday_features import add_holiday_features
from features.lag_features import add_lag_features
from features.rolling_features import add_rolling_features
from features.time_features import add_time_features
from features.weather_features import add_weather_features


def build_features(snapshots: pd.DataFrame, weather: pd.DataFrame, horizon_hours: int) -> pd.DataFrame:
    df = snapshots.sort_values(["hospital_id", "scraped_at"]).copy()
    df["target"] = df.groupby("hospital_id")["wait_minutes"].shift(-horizon_hours * 2)
    df = add_lag_features(df)
    df = add_rolling_features(df)
    df = add_time_features(df)
    df = add_weather_features(df, weather)
    df = add_holiday_features(df)
    return df.dropna(subset=["target"])
