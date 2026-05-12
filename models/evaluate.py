from __future__ import annotations

import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error


def regression_metrics(actual: np.ndarray, predicted: np.ndarray) -> dict[str, float]:
    return {
        "rmse": float(mean_squared_error(actual, predicted, squared=False)),
        "mae": float(mean_absolute_error(actual, predicted)),
        "mape": float(np.mean(np.abs((actual - predicted) / np.maximum(actual, 1))) * 100),
    }
