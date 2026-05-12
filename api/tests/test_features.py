import pandas as pd

from features.builder import build_features


def test_build_features_adds_target() -> None:
    snapshots = pd.DataFrame(
        {
            "hospital_id": ["h1"] * 10,
            "wait_minutes": list(range(10)),
            "patients_waiting": list(range(10)),
            "scraped_at": pd.date_range("2026-01-01", periods=10, freq="30min", tz="UTC"),
        }
    )
    weather = pd.DataFrame(
        {
            "recorded_at": pd.date_range("2026-01-01", periods=10, freq="30min", tz="UTC"),
            "temperature_c": [0] * 10,
            "precipitation_mm": [0] * 10,
            "wind_kph": [10] * 10,
        }
    )

    result = build_features(snapshots, weather, horizon_hours=2)

    assert "target" in result.columns
    assert len(result) > 0
