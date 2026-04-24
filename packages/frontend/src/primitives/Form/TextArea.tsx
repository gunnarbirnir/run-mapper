import type { TextareaHTMLAttributes } from 'react';
import { cn } from '~/utils';

import { InputLabel } from './InputLabel';
import { Text } from '../Text';

type TextAreaProps = {
  label: string;
  error?: string;
  labelClassName?: string;
  onChange?: (value: string) => void;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>;

export const TextArea = ({
  id,
  label,
  placeholder,
  error,
  className,
  labelClassName,
  onChange,
  ...props
}: TextAreaProps) => {
  return (
    <div>
      <InputLabel htmlFor={id} className={labelClassName}>
        {label}
      </InputLabel>
      <textarea
        {...props}
        id={id}
        rows={6}
        placeholder={placeholder || label}
        className={cn(
          'w-full rounded border border-gray-300 px-3 py-2',
          { 'border-error-600': error },
          className,
        )}
        style={{ verticalAlign: 'bottom' }}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {error && <Text className="text-error-600 mt-2 text-xs">{error}</Text>}
    </div>
  );
};
