from __future__ import annotations

from pathlib import Path

import joblib
import lightgbm as lgb
import pandas as pd
from sklearn.model_selection import TimeSeriesSplit

from models.evaluate import regression_metrics
from models.lgbm_model import FEATURE_COLUMNS
from models.versioning import next_model_version


def train_lgbm(df: pd.DataFrame, horizon_hours: int, artifact_dir: Path = Path("models/artifacts")) -> tuple[lgb.LGBMRegressor, str]:
    X = df[FEATURE_COLUMNS]
    y = df["target"]
    model = lgb.LGBMRegressor(
        objective="regression",
        learning_rate=0.05,
        num_leaves=31,
        n_estimators=500,
    )

    for train_idx, val_idx in TimeSeriesSplit(n_splits=5).split(X):
        model.fit(X.iloc[train_idx], y.iloc[train_idx])
        predicted = model.predict(X.iloc[val_idx])
        print(regression_metrics(y.iloc[val_idx].to_numpy(), predicted))

    model.fit(X, y)
    version = next_model_version("lgbm", horizon_hours, artifact_dir)
    artifact_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, artifact_dir / f"{version}.joblib")
    return model, version
