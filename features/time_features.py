from __future__ import annotations

import numpy as np
import pandas as pd


def add_time_features(df: pd.DataFrame, timestamp_col: str = "scraped_at") -> pd.DataFrame:
    result = df.copy()
    ts = pd.to_datetime(result[timestamp_col], utc=True)
    result["hour_sin"] = np.sin(2 * np.pi * ts.dt.hour / 24)
    result["hour_cos"] = np.cos(2 * np.pi * ts.dt.hour / 24)
    result["dow_sin"] = np.sin(2 * np.pi * ts.dt.dayofweek / 7)
    result["dow_cos"] = np.cos(2 * np.pi * ts.dt.dayofweek / 7)
    result["month_sin"] = np.sin(2 * np.pi * ts.dt.month / 12)
    result["month_cos"] = np.cos(2 * np.pi * ts.dt.month / 12)
    return result
