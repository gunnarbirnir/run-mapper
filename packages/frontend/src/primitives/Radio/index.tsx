import { Radio as BaseUiRadio } from '@base-ui/react/radio';

import { cn } from '~/utils';

import { RadioGroup } from './RadioGroup';

interface RadioProps {
  value: string;
  children: string;
  className?: string;
}

const Radio = ({ value, children, className }: RadioProps) => {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2', className)}>
      <BaseUiRadio.Root
        value={value}
        className="flex size-5 items-center justify-center rounded-full data-checked:bg-gray-800 data-unchecked:border data-unchecked:border-gray-400"
      >
        <BaseUiRadio.Indicator className="flex before:size-2 before:rounded-full before:bg-gray-50 data-unchecked:hidden" />
      </BaseUiRadio.Root>
      {children}
    </label>
  );
};

Radio.Group = RadioGroup;

export { Radio };
