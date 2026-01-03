import { cn } from '~/utils';

import { InputLabel } from './InputLabel';

interface TextInputProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
}

export const TextInput = ({
  id,
  name,
  label,
  placeholder,
  className,
  labelClassName,
}: TextInputProps) => {
  return (
    <div>
      <InputLabel htmlFor={id} className={labelClassName}>
        {label}
      </InputLabel>
      <input
        type="text"
        id={id}
        name={name}
        placeholder={placeholder}
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded',
          className
        )}
      />
    </div>
  );
};
