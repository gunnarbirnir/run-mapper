import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getCssVariableValue = (variable: string) => {
  try {
    const styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue(variable);
  } catch {
    return '';
  }
};

export const areCssVariablesLoaded = () => {
  return getCssVariableValue('--color-primary-500') !== '';
};

export const convertRemToPixels = (rem: string) => {
  try {
    const remNum = parseFloat(rem.replace('rem', ''));
    return (
      remNum * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  } catch {
    return 0;
  }
};

const BASE_SPACING = 0.25;

export const spacingRem = (factor: number) => {
  return `${BASE_SPACING * factor}rem`;
};

export const spacingPx = (factor: number) => {
  try {
    const spacingVal = BASE_SPACING * factor;

    return (
      spacingVal *
      parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  } catch {
    return 0;
  }
};

export const formatNumber = (number: number, maxDecimals: number = 1) => {
  return parseFloat(number.toFixed(maxDecimals));
};

export const formatDate = (date: string) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
