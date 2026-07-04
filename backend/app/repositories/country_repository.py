"""Country data repository."""

import json
from pathlib import Path

from app.models.country import Country


class CountryRepository:
    """
    Loads country metadata from JSON.

    Designed with an interface that can be swapped for a PostgreSQL
    implementation without changing consumers.
    """

    def __init__(self, data_path: Path | None = None) -> None:
        if data_path is None:
            data_path = Path(__file__).resolve().parent.parent / "data" / "countries.json"
        self._data_path = data_path
        self._countries: list[Country] = []
        self._by_name: dict[str, Country] = {}
        self._by_code: dict[str, Country] = {}
        self._load()

    def _load(self) -> None:
        raw = json.loads(self._data_path.read_text(encoding="utf-8"))
        self._countries = [Country.model_validate(item) for item in raw]
        self._by_name = {c.name: c for c in self._countries}
        self._by_code = {c.country_code: c for c in self._countries}

    def get_all(self) -> list[Country]:
        return list(self._countries)

    def get_by_name(self, name: str) -> Country | None:
        return self._by_name.get(name)

    def get_by_code(self, code: str) -> Country | None:
        return self._by_code.get(code.upper())

    def count(self) -> int:
        return len(self._countries)
