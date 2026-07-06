import React, { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStore } from '../../store/mapStore';
import { useAttackStore } from '../../store/attackStore';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const assetRegions = [
  { name: 'US-East Edge', coordinates: [-77.5, 38.8], severity: 92 },
  { name: 'EU-West Core', coordinates: [8.6, 50.1], severity: 71 },
  { name: 'APAC Gateway', coordinates: [103.8, 1.35], severity: 64 },
  { name: 'India App Cluster', coordinates: [77.2, 28.6], severity: 84 },
];

function squareFeature(asset: typeof assetRegions[number]) {
  const [lon, lat] = asset.coordinates;
  const size = 2.8;
  return {
    type: 'Feature',
    properties: asset,
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [lon - size, lat - size],
        [lon + size, lat - size],
        [lon + size, lat + size],
        [lon - size, lat + size],
        [lon - size, lat - size],
      ]],
    },
  };
}

export const AssetMap: React.FC<any> = ({ children }) => {
  const { viewState, setViewState } = useMapStore();
  const { attacks } = useAttackStore();

  const layers = useMemo(() => {
    const impactedAssets = assetRegions.map((asset) => {
      const related = attacks.filter((attack: any) => Math.abs((attack.destination_longitude ?? 0) - asset.coordinates[0]) < 18 && Math.abs((attack.destination_latitude ?? 0) - asset.coordinates[1]) < 12);
      return { ...asset, attacks: related.length, severity: Math.max(asset.severity, ...related.map((attack: any) => attack.risk_score ?? 0)) };
    });

    const geojson = {
      type: 'FeatureCollection',
      features: impactedAssets.map(squareFeature),
    } as any;

    return [
      new GeoJsonLayer({
        id: 'asset-risk-regions',
        data: geojson,
        filled: true,
        stroked: true,
        getFillColor: (feature: any) => {
          const severity = feature.properties.severity;
          return severity > 85 ? [239, 68, 68, 85] : severity > 70 ? [249, 115, 22, 75] : [34, 211, 238, 65];
        },
        getLineColor: [226, 232, 240, 190],
        lineWidthMinPixels: 1,
        pickable: true,
      }),
      new ScatterplotLayer({
        id: 'asset-location-markers',
        data: impactedAssets,
        getPosition: (d: any) => d.coordinates,
        getRadius: (d: any) => 26000 + d.severity * 550,
        getFillColor: (d: any) => d.severity > 85 ? [239, 68, 68, 180] : [34, 211, 238, 160],
        getLineColor: [255, 255, 255, 220],
        lineWidthMinPixels: 1,
        stroked: true,
      }),
    ];
  }, [attacks]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-white/10 bg-slate-950">
      <DeckGL
        initialViewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
      >
        <Map mapStyle={MAP_STYLE} reuseMaps attributionControl={false} />
      </DeckGL>
      {children}
    </div>
  );
};
