import { Text } from '~/primitives';
import { cn } from '~/utils';

import { ListItemContainer } from './ListItemContainer';

interface ListItemProps {
  label: string;
  value: string;
  className?: string;
}

const ListItem = ({ label, value, className }: ListItemProps) => {
  return (
    <div
      className={cn('flex items-center justify-between px-4 py-2', className)}
    >
      <Text className="font-medium">{label}</Text>
      <Text className="text-gray-700">{value}</Text>
    </div>
  );
};

ListItem.Container = ListItemContainer;

export { ListItem };
