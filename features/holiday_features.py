from __future__ import annotations

import pandas as pd


ALBERTA_STAT_HOLIDAYS = {
    "01-01",
    "07-01",
    "11-11",
    "12-25",
}


def add_holiday_features(df: pd.DataFrame, timestamp_col: str = "scraped_at") -> pd.DataFrame:
    result = df.copy()
    ts = pd.to_datetime(result[timestamp_col], utc=True)
    result["is_holiday"] = ts.dt.strftime("%m-%d").isin(ALBERTA_STAT_HOLIDAYS)
    result["days_to_holiday"] = ts.apply(days_to_next_fixed_holiday)
    return result


def days_to_next_fixed_holiday(timestamp: pd.Timestamp) -> int:
    current = timestamp.date()
    candidates = []
    for holiday in ALBERTA_STAT_HOLIDAYS:
        month, day = [int(part) for part in holiday.split("-")]
        candidates.append(pd.Timestamp(year=current.year, month=month, day=day).date())
        candidates.append(pd.Timestamp(year=current.year + 1, month=month, day=day).date())
    return min((candidate - current).days for candidate in candidates if candidate >= current)
