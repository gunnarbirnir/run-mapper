import { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';

import { RouteMap } from '~/components/RouteMap';
import { ElevationGraph } from '~/components/ElevationGraph';
import { DistanceWidget } from '~/components/DistanceWidget';
import { ElevationWidget } from '~/components/ElevationWidget';
import { useElementSize } from '~/hooks/useElementSize';
import type { WidgetType } from '~/types';
import { WIDGET_ANIMATION_DURATION, ELEVATION_GRAPH_HEIGHT } from '~/constants';

import type { RunRouteProps } from './types';
import { getRouteBounds, processRunRoute } from './utils';

export const RunRoute = ({ routeId, run }: RunRouteProps) => {
  const bounds = useMemo(
    () => getRouteBounds(run.boundingBox),
    // Only update map if routeId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [routeId],
  );
  const { coordinates, elevations } = useMemo(
    () => processRunRoute(run.coordinates),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [routeId],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const waypoints = useMemo(() => run.waypoints, [routeId]);
  const setActiveIndexRef = useRef<
    ((updatedIndex: number | null) => void) | null
  >(null);

  const [activeWidget, setActiveWidget] = useState<WidgetType | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContainerSize = useElementSize(mapContainerRef);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1" ref={mapContainerRef}>
        <RouteMap
          routeId={routeId}
          bounds={bounds}
          coordinates={coordinates}
          waypoints={waypoints}
          setActiveIndexRef={setActiveIndexRef}
        />
      </div>
      <ElevationGraph
        elevations={elevations}
        setActiveIndexRef={setActiveIndexRef}
      />
      <div className="pointer-events-none absolute z-100 h-full w-full">
        <motion.div
          animate={{ opacity: activeWidget ? 1 : 0 }}
          transition={{ duration: WIDGET_ANIMATION_DURATION, ease: 'easeOut' }}
          className="absolute top-0 right-0 left-0 z-0 bg-black/50"
          style={{
            pointerEvents: activeWidget ? 'auto' : 'none',
            bottom: activeWidget === 'elevation' ? ELEVATION_GRAPH_HEIGHT : 0,
          }}
        />
        <DistanceWidget
          index={0}
          coordinates={coordinates}
          mapContainerSize={mapContainerSize}
          isActive={activeWidget === 'distance'}
          setIsActive={(updatedIsActive) =>
            setActiveWidget(updatedIsActive ? 'distance' : null)
          }
        />
        <ElevationWidget
          index={1}
          elevations={elevations}
          mapContainerSize={mapContainerSize}
          isActive={activeWidget === 'elevation'}
          setIsActive={(updatedIsActive) =>
            setActiveWidget(updatedIsActive ? 'elevation' : null)
          }
        />
      </div>
    </div>
  );
};

export type { RunRouteProps };
