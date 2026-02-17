import { Text } from '~/primitives';

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
      <Text variant="medium" className="text-sm">
        {label}:
      </Text>
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
      <TooltipText label="Distance" value={`${distance.toFixed(2)} km`} />
      <TooltipText label="Elevation" value={`${value.toFixed(1)} m`} />
    </div>
  );
};
