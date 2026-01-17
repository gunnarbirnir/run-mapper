import { useMemo, type MutableRefObject, useState, useEffect } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { motion } from 'motion/react';

import {
  ELEVATION_GRAPH_HEIGHT,
  EXPANDED_ELEVATION_GRAPH_HEIGHT,
  WIDGET_ANIMATION_DURATION,
} from '~/constants';
import { getCssVariableValue, spacingPx } from '~/utils';
import type { Elevation } from '~/types';

import { processElevationData, getActiveIndexValue } from './utils';

interface ElevationGraphProps {
  elevations: Elevation[];
  setActiveIndexRef: MutableRefObject<
    ((updatedIndex: number | null) => void) | null
  >;
  isExpanded?: boolean;
}

const STROKE_WIDTH = 3;
const AXIS_LINE_WIDTH = 1;
const ACTIVE_LINE_WIDTH = 2;

export const ElevationGraph = ({
  elevations,
  setActiveIndexRef,
  isExpanded = false,
}: ElevationGraphProps) => {
  const [startExpansion, setStartExpansion] = useState(false);
  const lineColor = getCssVariableValue('--color-secondary-500');
  const gridColor = getCssVariableValue('--color-gray-300');
  const textColor = getCssVariableValue('--color-gray-500');
  const activeLineColor = getCssVariableValue('--color-black');
  const xsText = getCssVariableValue('--text-xs');

  const lastDistance = Math.floor(elevations[elevations.length - 1].distance);
  const elevationData = useMemo(
    () => processElevationData(elevations),
    [elevations],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartExpansion(true);
    const expandTimeout = setTimeout(() => {
      setStartExpansion(false);
    }, WIDGET_ANIMATION_DURATION * 1000);
    return () => clearTimeout(expandTimeout);
  }, [isExpanded]);

  return (
    <motion.div
      animate={
        isExpanded
          ? {
              height: EXPANDED_ELEVATION_GRAPH_HEIGHT,
            }
          : undefined
      }
      transition={{ duration: WIDGET_ANIMATION_DURATION, ease: 'easeOut' }}
      style={{ height: ELEVATION_GRAPH_HEIGHT }}
    >
      {!startExpansion && (
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <LineChart
            style={{ width: '100%', height: '100%' }}
            responsive
            data={elevationData}
            margin={{
              top: spacingPx(3),
              right: 1,
              bottom: 0,
              left: 0,
            }}
            onMouseEnter={(event) => {
              setActiveIndexRef.current?.(
                getActiveIndexValue(event.activeIndex),
              );
            }}
            onMouseLeave={() => {
              setActiveIndexRef.current?.(null);
            }}
            onMouseMove={(event) => {
              if (event.activeIndex) {
                setActiveIndexRef.current?.(
                  getActiveIndexValue(event.activeIndex),
                );
              }
            }}
          >
            <CartesianGrid stroke={gridColor} />
            <Tooltip
              cursor={{
                stroke: activeLineColor,
                strokeWidth: ACTIVE_LINE_WIDTH,
              }}
              content={<></>}
            />
            <Line
              dataKey="value"
              stroke={lineColor}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="butt"
              strokeLinejoin="round"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
            <XAxis
              dataKey="distance"
              height={spacingPx(5)}
              axisLine={{ stroke: gridColor, strokeWidth: AXIS_LINE_WIDTH }}
              ticks={Array.from({ length: lastDistance }, (_, i) => i + 1)}
              tick={{ fill: textColor, fontSize: xsText }}
              tickFormatter={(value) => `${value.toFixed(1)} km`}
              tickLine={false}
              tickMargin={spacingPx(1)}
              minTickGap={spacingPx(10)}
            />
            <YAxis
              dataKey="value"
              width={spacingPx(10)}
              axisLine={{ stroke: gridColor, strokeWidth: AXIS_LINE_WIDTH }}
              tick={{ fill: textColor, fontSize: xsText }}
              tickFormatter={(value) => `${value.toFixed(0)} m`}
              tickLine={false}
              tickMargin={spacingPx(1)}
              minTickGap={spacingPx(5)}
            />
          </LineChart>
        </motion.div>
      )}
    </motion.div>
  );
};
