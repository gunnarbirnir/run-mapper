import type { PVariant } from './types';

export const pGetVariantClassName = (variant: PVariant = 'default') => {
  switch (variant) {
    case 'label':
      return 'text-xs text-gray-500 uppercase tracking-wide';
    case 'subtle':
      return 'text-gray-500';
    case 'paragraph':
      return 'text-gray-700 mb-4';
    default:
      return 'text-gray-900';
  }
};
