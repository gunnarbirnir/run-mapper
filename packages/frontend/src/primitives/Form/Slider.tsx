import { cn } from '~/utils';

import { Slider as SliderComponent, type SliderProps } from '../Slider';
import { Text } from '../Text';
import { InputLabel } from './InputLabel';

interface SliderInputProps extends Omit<SliderProps, 'id'> {
  id: string;
  label: string;
  error?: string;
  infoText?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export const SliderInput = ({
  id,
  label,
  error,
  infoText,
  className,
  containerClassName,
  labelClassName,
  ...props
}: SliderInputProps) => {
  return (
    <div className={containerClassName}>
      <InputLabel htmlFor={id} className={labelClassName} infoText={infoText}>
        {label}
      </InputLabel>
      <SliderComponent
        {...props}
        className={cn({ 'border-error-600': error }, className)}
      />
      {error && <Text className="text-error-600 mt-1 text-xs">{error}</Text>}
    </div>
  );
};
