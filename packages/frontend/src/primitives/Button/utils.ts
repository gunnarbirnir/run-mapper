import { cn } from '~/utils';

export type ButtonColor =
  | 'black'
  | 'white'
  | 'gray'
  | 'secondary'
  | 'success'
  | 'successOutline'
  | 'error'
  | 'errorOutline';

const BUTTON_COLORS: Record<
  ButtonColor,
  {
    bg: string;
    text: string;
    hover: string;
    disabled: string;
    disabledText: string;
    borderColor?: string;
  }
> = {
  black: {
    bg: 'bg-gray-800',
    text: 'text-white',
    hover: 'hover:bg-gray-700',
    disabled: 'bg-gray-500',
    disabledText: 'text-gray-200',
  },
  white: {
    bg: 'bg-white',
    text: 'text-gray-800',
    hover: 'hover:bg-gray-100',
    disabled: 'bg-gray-300',
    disabledText: 'text-gray-500',
  },
  gray: {
    bg: 'bg-gray-200',
    text: 'text-gray-800',
    hover: 'hover:bg-gray-300',
    disabled: 'bg-gray-300',
    disabledText: 'text-gray-400',
  },
  secondary: {
    bg: 'bg-secondary-500',
    text: 'text-white',
    hover: 'hover:bg-secondary-600',
    disabled: 'bg-secondary-300',
    disabledText: 'text-secondary-100',
  },
  success: {
    bg: 'bg-success-500',
    text: 'text-white',
    hover: 'hover:bg-success-600',
    disabled: 'bg-success-300',
    disabledText: 'text-gray-100',
  },
  successOutline: {
    bg: 'bg-white',
    text: 'text-success-600',
    hover: 'hover:bg-success-600 hover:text-white',
    disabled: 'border-error-300',
    disabledText: 'text-success-300',
    borderColor: 'border-success-600',
  },
  error: {
    bg: 'bg-error-500',
    text: 'text-white',
    hover: 'hover:bg-error-600',
    disabled: 'bg-error-300',
    disabledText: 'text-gray-100',
  },
  errorOutline: {
    bg: 'bg-white',
    text: 'text-error-600',
    hover: 'hover:bg-error-600 hover:text-white',
    disabled: 'border-error-300',
    disabledText: 'text-error-300',
    borderColor: 'border-error-600',
  },
};

export const getColorClassName = (
  color: ButtonColor,
  { disabled }: { disabled: boolean },
) => {
  return cn(
    BUTTON_COLORS[color].bg,
    BUTTON_COLORS[color].text,
    BUTTON_COLORS[color].borderColor,
    { [BUTTON_COLORS[color].disabled]: disabled },
    { [BUTTON_COLORS[color].disabledText]: disabled },
    { [BUTTON_COLORS[color].hover]: !disabled },
    { border: BUTTON_COLORS[color].borderColor },
  );
};
