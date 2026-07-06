import React, { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStore } from '../../store/mapStore';
import { useAttackStore } from '../../store/attackStore';
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const WorldThreatMap: React.FC<any> = ({ children }) => {
  const { viewState, setViewState, setHoveredObject } = useMapStore();
  const { attacks } = useAttackStore();

  const layers = useMemo(() => {
    const latestAttacks = attacks.slice(0, 100);

    const arcLayer = new ArcLayer({
      id: 'live-attack-arcs',
      data: latestAttacks,
      getSourcePosition: (d: any) => [d.source_longitude, d.source_latitude],
      getTargetPosition: (d: any) => [d.destination_longitude, d.destination_latitude],
      getSourceColor: [239, 68, 68, 170],
      getTargetColor: [45, 212, 191, 220],
      getWidth: (d: any) => Math.max(1.2, Math.min(6, (d.risk_score || 50) / 18)),
      pickable: true,
      autoHighlight: true,
      onHover: ({ object }) => setHoveredObject(object ?? null),
    });

    const heatLayer = new HeatmapLayer({
      id: 'attack-heatmap',
      data: latestAttacks,
      getPosition: (d: any) => [d.destination_longitude, d.destination_latitude],
      getWeight: (d: any) => d.risk_score || 50,
      radiusPixels: 44,
      intensity: 1.5,
      threshold: 0.02,
    });
    
    return [heatLayer, arcLayer];
  }, [attacks, setHoveredObject]);

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
