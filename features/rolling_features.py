from __future__ import annotations

import pandas as pd


def add_rolling_features(df: pd.DataFrame) -> pd.DataFrame:
    result = df.sort_values(["hospital_id", "scraped_at"]).copy()
    grouped = result.groupby("hospital_id")["wait_minutes"]
    result["roll_3h"] = grouped.transform(lambda s: s.rolling(6, min_periods=2).mean())
    result["roll_6h"] = grouped.transform(lambda s: s.rolling(12, min_periods=4).mean())
    result["roll_24h"] = grouped.transform(lambda s: s.rolling(48, min_periods=8).mean())
    return result
