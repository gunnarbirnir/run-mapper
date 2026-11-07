import { useState, useEffect } from 'react';
import {
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { motion } from 'motion/react';

import { DEFAULT_FADE_IN_DURATION, DEFAULT_EASING } from '~/constants';
import { formatNumber, getCssVariableValue, spacingPx } from '~/utils';
import type { PublicRoute } from '~/types';
import { useId } from '~/hooks/useId';

import { WIDGET_ANIMATION_DURATION } from '../../constants';
import { useElevationGraphHeight } from '../../hooks/useElevationGraphHeight';
import { getActiveIndexValue, getElevationGraphData } from './utils';
import { GraphTooltip } from './GraphTooltip';
import { useGraphTicks } from './useGraphTicks';

interface ElevationGraphProps {
  route: PublicRoute | null;
  isExpanded?: boolean;
  isTooltipActive?: boolean;
  onActiveIndexChange?: (activeIndex: number | null) => void;
}

const STROKE_WIDTH = 3;
const AXIS_LINE_WIDTH = 1;
const ACTIVE_LINE_WIDTH = 2;

export const ElevationGraph = ({
  route,
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

  const { maxElevation = 0, minElevation = 0 } = route?.elevationStats ?? {};
  const coordinates = route?.coordinates ?? [];
  const yAxisWidth = spacingPx(Math.floor(maxElevation).toString().length * 5);
  const { xTicks, lastDistance, yTicks } = useGraphTicks({
    isExpanded,
    coordinates,
    maxElevation,
    minElevation,
  });
  const elevationGraphData = getElevationGraphData(coordinates);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartExpansion(true);
    const expandTimeout = setTimeout(() => {
      setStartExpansion(false);
    }, WIDGET_ANIMATION_DURATION * 1000);
    return () => clearTimeout(expandTimeout);
  }, [isExpanded]);

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;
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
      initial={{ height: compactHeight }}
      animate={{
        height: isExpanded ? expandedHeight : compactHeight,
      }}
      transition={{
        duration: WIDGET_ANIMATION_DURATION,
        ease: DEFAULT_EASING,
      }}
      className="bg-gray-50 pt-1"
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
          <LineChart
            style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
            responsive
            data={elevationGraphData}
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
              tickFormatter={(value) => `${formatNumber(value, 1)} km`}
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
              tickFormatter={(value) => `${formatNumber(value, 0)} m`}
              tickLine={false}
              tickMargin={spacingPx(1)}
            />
          </LineChart>
        </motion.div>
      )}
    </motion.div>
  );
};
