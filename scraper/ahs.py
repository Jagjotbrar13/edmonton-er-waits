from __future__ import annotations

from dataclasses import dataclass
import re

import httpx

AHS_WAIT_TIMES_URL = "https://www.albertahealthservices.ca/Webapps/WaitTimes/api/waittimes/en"


@dataclass(frozen=True)
class WaitTimeSnapshot:
    hospital_name: str
    wait_minutes: int
    patients_waiting: int | None
    address: str | None = None
    latitude: float | None = None
    longitude: float | None = None


def parse_wait_text(text: str) -> int:
    normalized = text.strip().lower()
    hours = re.search(r"(\d+)\s*h", normalized)
    minutes = re.search(r"(\d+)\s*m", normalized)
    total = 0
    if hours:
        total += int(hours.group(1)) * 60
    if minutes:
        total += int(minutes.group(1))
    if total == 0 and normalized.isdigit():
        total = int(normalized)
    return total


def parse_coordinates(link: str | None) -> tuple[float | None, float | None]:
    if not link:
        return None, None
    match = re.search(r"query=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)", link)
    if not match:
        return None, None
    return float(match.group(1)), float(match.group(2))


def fetch_wait_times(city: str = "Edmonton") -> list[WaitTimeSnapshot]:
    response = httpx.get(AHS_WAIT_TIMES_URL, timeout=30)
    response.raise_for_status()
    return parse_wait_times(response.json(), city=city)


def parse_wait_times(payload: dict, city: str = "Edmonton") -> list[WaitTimeSnapshot]:
    snapshots: list[WaitTimeSnapshot] = []
    city_data = payload.get(city, {})

    for item in city_data.get("Emergency", []):
        if item.get("TimesUnavailable") == "True":
            continue

        wait_text = item.get("WaitTime", "")
        wait_minutes = parse_wait_text(wait_text)
        if wait_minutes <= 0:
            continue
        latitude, longitude = parse_coordinates(item.get("GoogleMapsLinkDirection"))

        snapshots.append(
            WaitTimeSnapshot(
                hospital_name=item["Name"],
                wait_minutes=wait_minutes,
                patients_waiting=None,
                address=item.get("Address"),
                latitude=latitude,
                longitude=longitude,
            )
        )

    return snapshots
