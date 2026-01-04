import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getCssVariableValue = (variable: string) => {
  const styles = getComputedStyle(document.documentElement);
  return styles.getPropertyValue(variable);
};
