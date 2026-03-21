import type { Amenity } from '~/types';
import { Text, Icon, Tooltip } from '~/primitives';
import { cn } from '~/utils';
import { getWaypointLabel, getWaypointIconSize } from '~/utils/route';

import { ICONS } from './constants';

interface AmenitiesProps {
  waypointAmenities: Amenity[];
}

export const Amenities = ({ waypointAmenities }: AmenitiesProps) => {
  return (
    <div className="flex flex-col gap-3 pt-2">
      <Text variant="label">Amenities</Text>
      <Tooltip.Provider>
        <div className="flex flex-wrap gap-2">
          {waypointAmenities.map((amenity) => (
            <Tooltip
              key={amenity.type}
              label={amenity.label ?? getWaypointLabel(amenity.type)}
            >
              <div
                key={amenity.type}
                className="bg-secondary-500 flex h-6 w-6 items-center justify-center rounded-md shadow-sm"
              >
                <Icon
                  name={ICONS[amenity.type]}
                  className={cn(
                    // Keep same icon proportions but scale up slightly
                    'scale-[1.1] text-white',
                    getWaypointIconSize(amenity.type).size,
                  )}
                />
              </div>
            </Tooltip>
          ))}
        </div>
      </Tooltip.Provider>
    </div>
  );
};
