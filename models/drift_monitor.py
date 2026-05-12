from __future__ import annotations

import math


def rmse(errors: list[int]) -> float:
    if not errors:
        return 0.0
    return math.sqrt(sum(error**2 for error in errors) / len(errors))


def has_drift(errors: list[int], threshold_rmse: float = 25.0, min_samples: int = 50) -> bool:
    return len(errors) >= min_samples and rmse(errors) > threshold_rmse
