"""GeoJSON helpers for map layer integration."""

from typing import Any

import geojson


def countries_to_feature_collection(countries: list[dict[str, Any]]) -> geojson.FeatureCollection:
    """
    Convert country records to a GeoJSON FeatureCollection of Point features.

    Each feature includes country metadata as properties for frontend map layers.
    """
    features: list[geojson.Feature] = []
    for country in countries:
        feature = geojson.Feature(
            geometry=geojson.Point((country["longitude"], country["latitude"])),
            properties={
                "name": country["name"],
                "country_code": country["country_code"],
                "continent": country["continent"],
                "risk_level": country["risk_level"],
            },
        )
        features.append(feature)
    return geojson.FeatureCollection(features)
