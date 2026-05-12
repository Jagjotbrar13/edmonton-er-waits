from __future__ import annotations

import pandas as pd


def add_lag_features(df: pd.DataFrame) -> pd.DataFrame:
    result = df.sort_values(["hospital_id", "scraped_at"]).copy()
    grouped = result.groupby("hospital_id")["wait_minutes"]
    result["wait_lag_1h"] = grouped.shift(2)
    result["wait_lag_2h"] = grouped.shift(4)
    result["wait_lag_3h"] = grouped.shift(6)
    return result
