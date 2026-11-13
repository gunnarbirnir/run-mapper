import { Text } from '~/primitives';
import { formatNumber } from '~/utils';

interface GraphTooltipProps {
  payload?: {
    payload: {
      value: number;
      distance: number;
    };
  }[];
}

const TooltipText = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center gap-1">
      <Text className="text-sm font-medium">{label}:</Text>
      <Text variant="subtle" className="text-sm">
        {value}
      </Text>
    </div>
  );
};

export const GraphTooltip = ({ payload }: GraphTooltipProps) => {
  if (!payload || payload.length === 0) {
    return null;
  }

  const { distance, value } = payload[0].payload;

  return (
    <div className="rounded-md bg-white/90 px-2 py-1 shadow-md/20">
      <TooltipText label="Distance" value={`${formatNumber(distance, 2)} km`} />
      <TooltipText label="Elevation" value={`${formatNumber(value, 1)} m`} />
    </div>
  );
};
