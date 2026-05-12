from __future__ import annotations

from dataclasses import dataclass

import httpx


@dataclass(frozen=True)
class WeatherSnapshot:
    city: str
    temperature_c: float | None
    precipitation_mm: float | None
    wind_kph: float | None
    condition: str | None


def fetch_weather(city: str = "Edmonton") -> WeatherSnapshot:
    # Open-Meteo keeps local development friction-free. Swap this adapter for
    # Environment Canada XML once the wait-time scraper is confirmed.
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": 53.5461,
        "longitude": -113.4938,
        "current": "temperature_2m,precipitation,wind_speed_10m",
    }
    response = httpx.get(url, params=params, timeout=30)
    response.raise_for_status()
    current = response.json().get("current", {})
    return WeatherSnapshot(
        city=city,
        temperature_c=current.get("temperature_2m"),
        precipitation_mm=current.get("precipitation"),
        wind_kph=current.get("wind_speed_10m"),
        condition=None,
    )
