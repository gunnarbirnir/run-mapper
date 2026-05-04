import type { InputHTMLAttributes } from 'react';
import { cn } from '~/utils';

import { InputLabel } from './InputLabel';
import { Text } from '../Text';

type TextInputProps = {
  label: string;
  infoText?: string;
  error?: string;
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
  pattern,
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
      <input
        {...props}
        id={id}
        type={type}
        placeholder={placeholder || label}
        pattern={pattern}
        className={cn(
          'w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400',
          { 'border-error-600': error },
          className,
        )}
        onChange={(e) => {
          if (!pattern || e.target.reportValidity()) {
            onChange(e.target.value);
          }
        }}
      />
      {error && <Text className="text-error-600 mt-2 text-xs">{error}</Text>}
    </div>
  );
};
