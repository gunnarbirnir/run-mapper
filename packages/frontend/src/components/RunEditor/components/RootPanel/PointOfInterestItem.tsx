import type { PointOfInterest } from '~/types';

interface PointOfInterestItemProps {
  pointOfInterest: PointOfInterest;
  onEditPointOfInterest: (id: string) => void;
}

export const PointOfInterestItem = ({
  pointOfInterest: { id, name },
  onEditPointOfInterest,
}: PointOfInterestItemProps) => {
  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-md bg-gray-100 px-4 py-2"
      onClick={() => onEditPointOfInterest(id)}
    >
      <span>{name}</span>
    </div>
  );
};
