import { cn } from '~/utils';

import { InputLabel } from './InputLabel';
import { Text } from '../Text';

interface TextAreaProps {
  id: string;
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export const TextArea = ({
  id,
  name,
  label,
  value,
  placeholder,
  error,
  className,
  labelClassName,
  onChange,
  onBlur,
}: TextAreaProps) => {
  return (
    <div>
      <InputLabel htmlFor={id} className={labelClassName}>
        {label}
      </InputLabel>
      <textarea
        id={id}
        name={name}
        rows={6}
        value={value}
        placeholder={placeholder}
        className={cn(
          'w-full rounded border border-gray-300 px-3 py-2',
          { 'border-error-600': error },
          className,
        )}
        style={{ verticalAlign: 'bottom' }}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
      />
      {error && <Text className="text-error-600 mt-2 text-xs">{error}</Text>}
    </div>
  );
};
