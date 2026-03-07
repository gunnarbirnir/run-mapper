import { Text } from '../Text';
import { Icon, type IconName } from '../Icon';

import { cn } from '~/utils';

import { ListItemContainer } from './ListItemContainer';

interface ListItemProps {
  label: string;
  value: string;
  className?: string;
  icon?: IconName;
  iconClassName?: string;
}

const ListItem = ({
  label,
  value,
  className,
  icon,
  iconClassName,
}: ListItemProps) => {
  return (
    <div
      className={cn('flex items-center justify-between px-2 py-2', className)}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <div className="flex size-6 shrink-0 items-center justify-center">
            <Icon
              name={icon}
              className={cn('size-5 text-gray-500', iconClassName)}
            />
          </div>
        )}
        <Text variant="medium">{label}</Text>
      </div>
      <Text variant="subtle">{value}</Text>
    </div>
  );
};

ListItem.Container = ListItemContainer;

export { ListItem };
