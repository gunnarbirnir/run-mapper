import { type ReactNode } from 'react';
import { RadioGroup as BaseUiRadioGroup } from '@base-ui/react/radio-group';

interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
  onChange?: (value: unknown) => void;
}

export const RadioGroup = ({
  value,
  defaultValue,
  labelledBy,
  children,
  className,
  onChange,
}: RadioGroupProps) => {
  return (
    <BaseUiRadioGroup
      aria-labelledby={labelledBy}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onChange}
      className={className}
    >
      {children}
    </BaseUiRadioGroup>
  );
};
