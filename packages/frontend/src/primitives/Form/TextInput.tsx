import type { InputHTMLAttributes } from 'react';
import { cn } from '~/utils';

import { InputLabel } from './InputLabel';
import { Text } from '../Text';

type TextInputProps = {
  label: string;
  infoText?: string;
  error?: string;
  unit?: string;
  labelClassName?: string;
  containerClassName?: string;
  onChange: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

export const TextInput = ({
  id,
  label,
  type = 'text',
  placeholder,
  infoText,
  error,
  unit,
  pattern,
  disabled,
  className,
  labelClassName,
  containerClassName,
  onChange,
  ...props
}: TextInputProps) => {
  return (
    <div className={containerClassName}>
      <InputLabel htmlFor={id} className={labelClassName} infoText={infoText}>
        {label}
      </InputLabel>
      <div
        className={cn('flex w-full items-center rounded-sm', {
          'bg-gray-200': unit,
        })}
      >
        <input
          {...props}
          id={id}
          type={type}
          placeholder={placeholder || label}
          pattern={pattern}
          disabled={disabled}
          className={cn(
            'w-full flex-1 rounded-l-sm border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400',
            {
              'border-error-600': error,
              'bg-gray-100': disabled,
              'rounded-r-sm': !unit,
            },
            className,
          )}
          onChange={(e) => {
            if (!pattern || e.target.reportValidity()) {
              onChange(e.target.value);
            }
          }}
        />
        {unit ? (
          <Text className="px-3 text-sm text-gray-500">{unit}</Text>
        ) : null}
      </div>
      {error && <Text className="text-error-600 mt-2 text-xs">{error}</Text>}
    </div>
  );
};
