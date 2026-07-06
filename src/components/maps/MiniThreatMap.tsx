import React, { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStore } from '../../store/mapStore';
import { useAttackStore } from '../../store/attackStore';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const MiniThreatMap: React.FC<any> = ({ children }) => {
  const { viewState, setViewState } = useMapStore();
  const { attacks } = useAttackStore();

  const layers = useMemo(() => {
    // Deck.gl layers will go here
    return [];
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
