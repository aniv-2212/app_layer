import React, { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStore } from '../../store/mapStore';
import { useAttackStore } from '../../store/attackStore';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const NetworkTopology: React.FC<any> = ({ children }) => {
  const { viewState, setViewState } = useMapStore();
  const { attacks } = useAttackStore();

  const layers = useMemo(() => {
    const latestAttacks = attacks.slice(0, 80);
    const nodesByName = new globalThis.Map<string, any>();

    latestAttacks.forEach((attack: any) => {
      nodesByName.set(attack.source_country ?? attack.source_ip ?? `source-${attack.id}`, {
        id: attack.source_country ?? attack.source_ip,
        label: attack.source_country ?? attack.source_ip,
        position: [attack.source_longitude, attack.source_latitude],
        type: 'source',
        risk: attack.risk_score ?? 50,
      });
      nodesByName.set(attack.destination_country ?? attack.destination_ip ?? `target-${attack.id}`, {
        id: attack.destination_country ?? attack.destination_ip,
        label: attack.destination_country ?? attack.destination_ip,
        position: [attack.destination_longitude, attack.destination_latitude],
        type: 'target',
        risk: attack.risk_score ?? 50,
      });
    });

    const nodes = Array.from(nodesByName.values()).filter((node) => node.position?.every(Number.isFinite));

    return [
      new ArcLayer({
        id: 'network-flow-edges',
        data: latestAttacks,
        getSourcePosition: (d: any) => [d.source_longitude, d.source_latitude],
        getTargetPosition: (d: any) => [d.destination_longitude, d.destination_latitude],
        getSourceColor: [248, 113, 113, 170],
        getTargetColor: [34, 211, 238, 220],
        getWidth: (d: any) => Math.max(1, Math.min(5, (d.risk_score ?? 50) / 20)),
      }),
      new ScatterplotLayer({
        id: 'network-topology-nodes',
        data: nodes,
        getPosition: (d: any) => d.position,
        getRadius: (d: any) => 22000 + (d.risk ?? 50) * 850,
        getFillColor: (d: any) => d.type === 'target' ? [34, 211, 238, 180] : [248, 113, 113, 160],
        getLineColor: [255, 255, 255, 220],
        lineWidthMinPixels: 1,
        stroked: true,
        pickable: true,
      }),
      new TextLayer({
        id: 'network-node-labels',
        data: nodes.slice(0, 24),
        getPosition: (d: any) => d.position,
        getText: (d: any) => d.label,
        getSize: 12,
        getColor: [226, 232, 240, 230],
        getPixelOffset: [0, -18],
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
