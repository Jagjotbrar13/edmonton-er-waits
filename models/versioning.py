from __future__ import annotations

from pathlib import Path


def next_model_version(prefix: str, horizon_hours: int, artifact_dir: Path) -> str:
    base = f"{prefix}_{horizon_hours}h_v"
    versions = []
    for path in artifact_dir.glob(f"{base}*.joblib"):
        suffix = path.stem.removeprefix(base)
        if suffix.isdigit():
            versions.append(int(suffix))
    return f"{base}{max(versions, default=0) + 1}"
