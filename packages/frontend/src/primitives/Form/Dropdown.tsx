import { cn } from '~/utils';

import { Dropdown as DropdownComponent, type DropdownProps } from '../Dropdown';
import { Text } from '../Text';
import { InputLabel } from './InputLabel';

interface DropdownInputProps extends Omit<DropdownProps, 'onChange' | 'id'> {
  id: string;
  label: string;
  error?: string;
  infoText?: string;
  containerClassName?: string;
  labelClassName?: string;
  onChange?: (value: string) => void;
}

export const DropdownInput = ({
  id,
  label,
  error,
  infoText,
  className,
  containerClassName,
  labelClassName,
  popupClassName,
  onChange,
  ...props
}: DropdownInputProps) => {
  return (
    <div className={containerClassName}>
      <InputLabel htmlFor={id} className={labelClassName} infoText={infoText}>
        {label}
      </InputLabel>
      <DropdownComponent
        {...props}
        align="start"
        className={cn(
          'w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900',
          { 'border-error-600': error },
          className,
        )}
        popupClassName={cn(
          'w-(--anchor-width) rounded bg-white text-gray-900 shadow-md border border-gray-300',
          popupClassName,
        )}
        onChange={(val) => {
          onChange?.(val ?? '');
        }}
      />
      {error && <Text className="text-error-600 mt-2 text-xs">{error}</Text>}
    </div>
  );
};
