import { cn } from '~/utils';

import { Slider as BaseUiSlider } from '@base-ui/react/slider';
import { CSSProperties } from 'react';

export interface SliderProps {
  id?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  onChange: (value: number) => void;
  onBlur?: () => void;
}

export const Slider = ({
  id,
  value,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  className,
  style,
  onChange,
  onBlur,
}: SliderProps) => {
  return (
    <BaseUiSlider.Root
      id={id}
      value={value}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      style={style}
      className={className}
      onValueChange={onChange}
      onBlur={onBlur}
      thumbAlignment="edge"
    >
      <BaseUiSlider.Control className="flex w-full touch-none items-center py-3 select-none">
        <BaseUiSlider.Track className="h-1 w-full rounded-sm bg-gray-200 select-none">
          <BaseUiSlider.Indicator
            className={cn('rounded-sm bg-gray-700 select-none', {
              'bg-gray-400': disabled,
            })}
          />
          <BaseUiSlider.Thumb
            aria-label="Volume"
            className={cn(
              'has-focus-visible:outline-secondary-500 size-4.5 rounded-full border border-gray-400 bg-white select-none has-focus-visible:outline-2',
              { 'border-gray-300': disabled },
            )}
          />
        </BaseUiSlider.Track>
      </BaseUiSlider.Control>
    </BaseUiSlider.Root>
  );
};
