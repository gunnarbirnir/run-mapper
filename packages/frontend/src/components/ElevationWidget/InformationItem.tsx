import { Text, type IconName, Icon } from '~/primitives';
import { cn } from '~/utils';

interface InformationItemProps {
  label: string;
  value: string;
  variant?: 'default' | 'success' | 'error';
  icon?: IconName;
  iconClassName?: string;
}

export const InformationItem = ({
  label,
  value,
  variant = 'default',
  icon,
  iconClassName,
}: InformationItemProps) => {
  return (
    <div
      className={cn('flex items-center justify-between rounded-lg px-4 py-2', {
        'bg-gray-100': variant === 'default',
        'bg-success-100': variant === 'success',
        'bg-error-100': variant === 'error',
      })}
    >
      <div
        className={cn('flex items-center gap-3', {
          'text-black': variant === 'default',
          'text-success-950': variant === 'success',
          'text-error-950': variant === 'error',
        })}
      >
        {icon && (
          <Icon
            name={icon}
            className={cn(
              {
                'text-gray-800': variant === 'default',
                'text-success-800': variant === 'success',
                'text-error-800': variant === 'error',
              },
              iconClassName,
            )}
          />
        )}
        <Text
          className={cn('font-bold', {
            'text-black': variant === 'default',
            'text-success-950': variant === 'success',
            'text-error-950': variant === 'error',
          })}
        >
          {label}
        </Text>
      </div>
      <Text
        className={cn({
          'text-gray-900': variant === 'default',
          'text-success-900': variant === 'success',
          'text-error-900': variant === 'error',
        })}
      >
        {value}
      </Text>
    </div>
  );
};
