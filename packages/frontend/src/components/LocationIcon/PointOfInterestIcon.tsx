import { PointOfInterestType } from '~/types';
import {
  getWaypointPoiIcon,
  getWaypointPoiIconSize,
  getPoiIconColor,
} from '~/utils/route';

interface PointOfInterestIconProps {
  type: PointOfInterestType;
}

export const PointOfInterestIcon = ({ type }: PointOfInterestIconProps) => {
  const groupIcon = getWaypointPoiIcon(type);
  const iconSize = getWaypointPoiIconSize(type);
  const bgColor = getPoiIconColor(type);

  return (
    <div
      className={
        'flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full border-3 border-white text-white shadow-md'
      }
      style={{ backgroundColor: `var(${bgColor})` }}
    >
      <span
        dangerouslySetInnerHTML={{ __html: groupIcon }}
        className={iconSize.width}
      />
    </div>
  );
};
