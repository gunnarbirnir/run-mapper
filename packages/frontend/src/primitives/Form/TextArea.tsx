import { cn } from '~/utils';

import { InputLabel } from './InputLabel';

interface TextAreaProps {
  id: string;
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  onChange?: (value: string) => void;
}

export const TextArea = ({
  id,
  name,
  label,
  value,
  placeholder,
  className,
  labelClassName,
  onChange,
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
          className,
        )}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};
