import { cn } from '~/utils';

import { InputLabel } from './InputLabel';

interface TextInputProps {
  id: string;
  name: string;
  value: string;
  label: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  onChange: (value: string) => void;
}

export const TextInput = ({
  id,
  name,
  value,
  label,
  placeholder,
  className,
  labelClassName,
  containerClassName,
  onChange,
}: TextInputProps) => {
  return (
    <div className={containerClassName}>
      <InputLabel htmlFor={id} className={labelClassName}>
        {label}
      </InputLabel>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        className={cn(
          'w-full rounded border border-gray-300 px-3 py-2',
          className,
        )}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
