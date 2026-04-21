import { cn } from '~/utils';

import { Dropdown as DropdownComponent } from '../Dropdown';
import { Text } from '../Text';
import { InputLabel } from './InputLabel';

interface DropdownProps {
  id: string;
  label: string;
  items: { label: string; value: string }[];
  value?: string;
  error?: string;
  infoText?: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  popupClassName?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export const Dropdown = ({
  id,
  label,
  items,
  value,
  error,
  infoText,
  className,
  containerClassName,
  labelClassName,
  popupClassName,
  onChange,
  onBlur,
}: DropdownProps) => {
  return (
    <div className={containerClassName}>
      <InputLabel htmlFor={id} className={labelClassName} infoText={infoText}>
        {label}
      </InputLabel>
      <DropdownComponent
        id={id}
        items={items}
        value={value}
        // side="left"
        align="start"
        className={cn(
          'w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400',
          { 'border-error-600': error },
          className,
        )}
        popupClassName={cn(
          'w-(--anchor-width)rounded bg-white text-gray-900 shadow-md border border-gray-300',
          popupClassName,
        )}
        onChange={(val) => {
          onChange(val ?? '');
          onBlur?.();
        }}
      />
      {error && <Text className="text-error-600 mt-2 text-xs">{error}</Text>}
    </div>
  );
};
