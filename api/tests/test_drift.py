from models.drift_monitor import has_drift, rmse


def test_rmse() -> None:
    assert rmse([3, 4]) == 3.5355339059327378


def test_drift_requires_minimum_samples() -> None:
    assert has_drift([100], threshold_rmse=25, min_samples=50) is False
