import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { getCssVariableValue, convertRemToPixels } from '~/utils';
import type { Elevation } from '~/types';

import { processElevationData } from './utils';

interface ElevationGraphProps {
  elevations: Elevation[];
}

const GRAPH_HEIGHT = 120;
const STROKE_WIDTH = 3;
const AXIS_LINE_WIDTH = 1;

export const ElevationGraph = ({ elevations }: ElevationGraphProps) => {
  const lineColor = getCssVariableValue('--color-secondary-700');
  const graphMargin = convertRemToPixels(getCssVariableValue('--spacing')) * 3;
  const tickSpacing = convertRemToPixels(getCssVariableValue('--spacing'));
  const xAxisHeight = convertRemToPixels(getCssVariableValue('--spacing')) * 5;
  const yAxisWidth = convertRemToPixels(getCssVariableValue('--spacing')) * 10;
  const xAxisTickGap =
    convertRemToPixels(getCssVariableValue('--spacing')) * 10;
  const yAxisTickGap = convertRemToPixels(getCssVariableValue('--spacing')) * 5;
  const gridColor = getCssVariableValue('--color-gray-300');
  const textColor = getCssVariableValue('--color-gray-500');
  const xsText = getCssVariableValue('--text-xs');

  const lastDistance = Math.floor(elevations[elevations.length - 1].distance);
  const elevationData = useMemo(
    () => processElevationData(elevations),
    [elevations],
  );

  return (
    <div style={{ height: GRAPH_HEIGHT }}>
      <LineChart
        style={{ width: '100%', height: '100%', outline: 'none' }}
        responsive
        data={elevationData}
        margin={{
          top: graphMargin,
          right: 1,
          bottom: 0,
          left: 0,
        }}
      >
        <CartesianGrid stroke={gridColor} />
        <Line
          dataKey="value"
          stroke={lineColor}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="butt"
          strokeLinejoin="round"
          dot={false}
        />
        <XAxis
          dataKey="distance"
          height={xAxisHeight}
          axisLine={{ stroke: gridColor, strokeWidth: AXIS_LINE_WIDTH }}
          ticks={Array.from({ length: lastDistance }, (_, i) => i + 1)}
          tick={{ fill: textColor, fontSize: xsText }}
          tickFormatter={(value) => `${value.toFixed(1)} km`}
          tickLine={false}
          tickMargin={tickSpacing}
          minTickGap={xAxisTickGap}
        />
        <YAxis
          dataKey="value"
          width={yAxisWidth}
          axisLine={{ stroke: gridColor, strokeWidth: AXIS_LINE_WIDTH }}
          tick={{ fill: textColor, fontSize: xsText }}
          tickFormatter={(value) => `${value.toFixed(0)} m`}
          tickLine={false}
          tickMargin={tickSpacing}
          minTickGap={yAxisTickGap}
        />
      </LineChart>
    </div>
  );
};
