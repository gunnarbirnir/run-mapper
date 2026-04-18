import { cn } from '~/utils';

import { InputLabel } from './InputLabel';

interface TextInputProps {
  id: string;
  name: string;
  value: string;
  label: string;
  type?: string;
  placeholder?: string;
  infoText?: string;
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
  type = 'text',
  placeholder,
  infoText,
  className,
  labelClassName,
  containerClassName,
  onChange,
}: TextInputProps) => {
  return (
    <div className={containerClassName}>
      <InputLabel htmlFor={id} className={labelClassName} infoText={infoText}>
        {label}
      </InputLabel>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder || label}
        className={cn(
          'w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400',
          className,
        )}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
