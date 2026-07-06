import React, { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStore } from '../../store/mapStore';
import { useAttackStore } from '../../store/attackStore';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const ThreatHeatmap: React.FC<any> = ({ children }) => {
  const { viewState, setViewState } = useMapStore();
  const { attacks } = useAttackStore();

  const layers = useMemo(() => {
    const latestAttacks = attacks.slice(0, 250).filter((attack: any) => Number.isFinite(attack.destination_longitude) && Number.isFinite(attack.destination_latitude));

    return [
      new HeatmapLayer({
        id: 'threat-density-heatmap',
        data: latestAttacks,
        getPosition: (d: any) => [d.destination_longitude, d.destination_latitude],
        getWeight: (d: any) => d.risk_score ?? d.request_count ?? 1,
        radiusPixels: 54,
        intensity: 1.8,
        threshold: 0.015,
      }),
      new ScatterplotLayer({
        id: 'threat-hotspot-points',
        data: latestAttacks.slice(0, 80),
        getPosition: (d: any) => [d.destination_longitude, d.destination_latitude],
        getRadius: (d: any) => 18000 + (d.risk_score ?? 50) * 500,
        getFillColor: [34, 211, 238, 95],
        getLineColor: [255, 255, 255, 160],
        stroked: true,
        lineWidthMinPixels: 1,
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
