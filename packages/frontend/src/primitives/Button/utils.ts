import { cn } from '~/utils';

export type ButtonColor = 'black' | 'white';

const BUTTON_COLORS: Record<
  ButtonColor,
  {
    bg: string;
    text: string;
    hover: string;
    disabled: string;
    disabledText: string;
  }
> = {
  black: {
    bg: 'bg-black',
    text: 'text-white',
    hover: 'hover:bg-gray-700',
    disabled: 'bg-gray-400',
    disabledText: 'text-gray-200',
  },
  white: {
    bg: 'bg-white',
    text: 'text-black',
    hover: 'hover:bg-gray-200',
    disabled: 'bg-gray-300',
    disabledText: 'text-gray-500',
  },
};

export const getColorClassName = (
  color: ButtonColor,
  { disabled }: { disabled: boolean },
) => {
  return cn(
    BUTTON_COLORS[color].bg,
    BUTTON_COLORS[color].text,
    { [BUTTON_COLORS[color].disabled]: disabled },
    { [BUTTON_COLORS[color].disabledText]: disabled },
    { [BUTTON_COLORS[color].hover]: !disabled },
  );
};
