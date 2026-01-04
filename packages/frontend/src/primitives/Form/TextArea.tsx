import { cn } from '~/utils';

import { InputLabel } from './InputLabel';

interface TextAreaProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
}

export const TextArea = ({
  id,
  name,
  label,
  placeholder,
  className,
  labelClassName,
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
        placeholder={placeholder}
        className={cn(
          'w-full rounded border border-gray-300 px-3 py-2',
          className,
        )}
      />
    </div>
  );
};
