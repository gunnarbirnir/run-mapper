import { useMemo, useState, useEffect } from 'react';
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
  WIDGET_ANIMATION_DURATION,
  DEFAULT_FADE_IN_DURATION,
  DEFAULT_EASING,
} from '~/constants';
import { getCssVariableValue, spacingPx } from '~/utils';
import { calculateMaxElevation } from '~/utils/route';
import type { Elevation } from '~/types';
import { useElevationGraphHeight } from '~/hooks/useElevationGraphHeight';
import { useId } from '~/hooks/useId';

import { processElevationData, getActiveIndexValue } from './utils';
import { GraphTooltip } from './GraphTooltip';
import { useGraphTicks } from './useGraphTicks';

interface ElevationGraphProps {
  elevations: Elevation[];
  isExpanded?: boolean;
  isTooltipActive?: boolean;
  onActiveIndexChange?: (activeIndex: number | null) => void;
}

const STROKE_WIDTH = 3;
const AXIS_LINE_WIDTH = 1;
const ACTIVE_LINE_WIDTH = 2;

export const ElevationGraph = ({
  elevations,
  isExpanded = false,
  isTooltipActive = true,
  onActiveIndexChange = () => {},
}: ElevationGraphProps) => {
  const { compactHeight, expandedHeight } = useElevationGraphHeight(isExpanded);
  const [startExpansion, setStartExpansion] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const elevationGraphId = useId('elevation-graph');

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

  useEffect(() => {
    let resizeTimeout: number;
    let previousWidth = window.innerWidth;

    const handleResize = () => {
      if (window.innerWidth === previousWidth) {
        return;
      }
      previousWidth = window.innerWidth;
      clearTimeout(resizeTimeout);
      setIsResizing(true);
      resizeTimeout = setTimeout(() => {
        setIsResizing(false);
      }, 100);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <motion.div
      id={elevationGraphId}
      animate={
        isExpanded
          ? {
              height: expandedHeight,
            }
          : undefined
      }
      transition={{
        duration: WIDGET_ANIMATION_DURATION,
        ease: DEFAULT_EASING,
      }}
      className="bg-gray-50 pt-1"
      style={{ height: compactHeight }}
      // Should come after powered by label
      tabIndex={45}
    >
      {!startExpansion && !isResizing && (
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: DEFAULT_FADE_IN_DURATION,
            ease: DEFAULT_EASING,
          }}
        >
          {elevationData.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
              No elevation data yet
            </div>
          ) : (
            <LineChart
              style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
              responsive
              data={elevationData}
              margin={{
                top: spacingPx(2),
                right: spacingPx(2),
                bottom: spacingPx(2),
                left: spacingPx(2),
              }}
              onMouseEnter={(event) => {
                onActiveIndexChange(getActiveIndexValue(event.activeIndex));
              }}
              onMouseLeave={() => {
                onActiveIndexChange(null);
              }}
              onMouseMove={(event) => {
                if (event.activeIndex) {
                  onActiveIndexChange(getActiveIndexValue(event.activeIndex));
                }
              }}
            >
              {[...xTicks, lastDistance].map((tick) => (
                <ReferenceLine
                  key={`x-${tick}`}
                  x={tick}
                  stroke={gridColor}
                  zIndex={0}
                />
              ))}
              {yTicks.map((tick) => (
                <ReferenceLine
                  key={`y-${tick}`}
                  y={tick}
                  stroke={gridColor}
                  zIndex={0}
                />
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
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
