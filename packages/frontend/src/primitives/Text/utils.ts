import type { PVariant } from './types';

export const pGetVariantClassName = (variant: PVariant = 'default') => {
  switch (variant) {
    case 'subtitle':
      return 'text-lg';
    default:
      return 'text-gray-600';
  }
};
