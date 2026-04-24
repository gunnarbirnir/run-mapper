import { WaypointType } from '~/types';
import { getWaypointPoiIcon, getWaypointPoiIconSize } from '~/utils/route';
import { cn } from '~/utils';

interface WaypointIconProps {
  type: WaypointType;
}

export const WaypointIcon = ({ type }: WaypointIconProps) => {
  const groupIcon = getWaypointPoiIcon(type);
  const iconSize = getWaypointPoiIconSize(type);

  return (
    <div
      className={cn(
        'bg-secondary-500 flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full border-3 border-white text-white shadow-md',
        {
          'bg-success-500 h-6 w-6 translate-x-px border-4': type === 'start',
        },
        { 'bg-error-500 h-6 w-6 translate-x-px border-4': type === 'end' },
      )}
    >
      <span
        dangerouslySetInnerHTML={{ __html: groupIcon }}
        className={iconSize.width}
      />
    </div>
  );
};
