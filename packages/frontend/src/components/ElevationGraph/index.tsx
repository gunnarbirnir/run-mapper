import { useMemo, type MutableRefObject, useState, useEffect } from 'react';
import {
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { motion } from 'motion/react';

import {
  ELEVATION_GRAPH_HEIGHT,
  EXPANDED_ELEVATION_GRAPH_HEIGHT,
  WIDGET_ANIMATION_DURATION,
  DEFAULT_FADE_IN_DURATION,
  DEFAULT_EASING,
} from '~/constants';
import { getCssVariableValue, spacingPx, calculateMaxElevation } from '~/utils';
import type { Elevation } from '~/types';

import { processElevationData, getActiveIndexValue } from './utils';
import { GraphTooltip } from './GraphTooltip';
import { useGraphTicks } from './useGraphTicks';

interface ElevationGraphProps {
  elevations: Elevation[];
  setActiveIndexRef: MutableRefObject<
    ((updatedIndex: number | null) => void) | null
  >;
  isExpanded?: boolean;
  isTooltipActive?: boolean;
}

const STROKE_WIDTH = 3;
const AXIS_LINE_WIDTH = 1;
const ACTIVE_LINE_WIDTH = 2;

export const ElevationGraph = ({
  elevations,
  setActiveIndexRef,
  isExpanded = false,
  isTooltipActive = true,
}: ElevationGraphProps) => {
  const [startExpansion, setStartExpansion] = useState(false);
  const lineColor = getCssVariableValue('--color-secondary-500');
  const gridColor = getCssVariableValue('--color-gray-300');
  const textColor = getCssVariableValue('--color-gray-500');
  const activeLineColor = getCssVariableValue('--color-gray-900');
  const xsText = getCssVariableValue('--text-xs');

  const elevationData = useMemo(
    () => processElevationData(elevations),
    [elevations],
  );
  const maxElevation = useMemo(
    () => calculateMaxElevation(elevationData),
    [elevationData],
  );
  const yAxisWidth = spacingPx(
    Math.floor(maxElevation.value).toString().length * 5,
  );
  const { xTicks, lastDistance, yTicks } = useGraphTicks({
    elevationData,
    isExpanded,
  });

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
      transition={{
        duration: WIDGET_ANIMATION_DURATION,
        ease: DEFAULT_EASING,
      }}
      className="bg-white pt-1 pb-1 pl-1"
      style={{ height: ELEVATION_GRAPH_HEIGHT }}
    >
      {!startExpansion && (
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: DEFAULT_FADE_IN_DURATION,
            ease: DEFAULT_EASING,
          }}
        >
          <LineChart
            style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
            responsive
            data={elevationData}
            margin={{
              top: spacingPx(2),
              right: 0.5,
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
            {[...xTicks, lastDistance].map((tick) => (
              <ReferenceLine key={`x-${tick}`} x={tick} stroke={gridColor} />
            ))}
            {yTicks.map((tick) => (
              <ReferenceLine key={`y-${tick}`} y={tick} stroke={gridColor} />
            ))}
            <Tooltip
              active={isTooltipActive === false ? false : undefined}
              cursor={{
                stroke: activeLineColor,
                strokeWidth: ACTIVE_LINE_WIDTH,
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              content={GraphTooltip as any}
              isAnimationActive={false}
              position={{ y: spacingPx(3) }}
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
              type="number"
              dataKey="distance"
              height={spacingPx(5)}
              axisLine={{ stroke: gridColor, strokeWidth: AXIS_LINE_WIDTH }}
              ticks={xTicks}
              tick={{ fill: textColor, fontSize: xsText }}
              tickFormatter={(value) => `${value.toFixed(1)} km`}
              tickLine={false}
              tickMargin={spacingPx(1)}
            />
            <YAxis
              type="number"
              dataKey="value"
              width={yAxisWidth}
              domain={[yTicks[0], yTicks[yTicks.length - 1]]}
              axisLine={{ stroke: gridColor, strokeWidth: AXIS_LINE_WIDTH }}
              ticks={yTicks}
              tick={{ fill: textColor, fontSize: xsText }}
              tickFormatter={(value) => `${value.toFixed(0)} m`}
              tickLine={false}
              tickMargin={spacingPx(1)}
            />
          </LineChart>
        </motion.div>
      )}
    </motion.div>
  );
};
