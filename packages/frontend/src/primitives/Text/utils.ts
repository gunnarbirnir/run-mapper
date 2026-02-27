import type { PVariant } from './types';

export const pGetVariantClassName = (variant: PVariant = 'default') => {
  switch (variant) {
    case 'label':
      return 'text-xs text-gray-500 uppercase';
    case 'bold':
      return 'font-bold text-gray-900';
    case 'medium':
      return 'font-medium text-gray-900';
    case 'subtle':
      return 'text-gray-500';
    case 'paragraph':
      return 'text-gray-700 mb-4';
    default:
      return 'text-gray-900';
  }
};
