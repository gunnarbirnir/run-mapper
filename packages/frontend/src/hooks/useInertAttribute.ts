import { useEffect } from 'react';

export const useInertAttribute = (
  ref: React.RefObject<HTMLElement>,
  isActive: boolean,
) => {
  useEffect(() => {
    if (ref.current) {
      if (isActive) {
        ref.current.setAttribute('inert', '');
      } else {
        ref.current.removeAttribute('inert');
      }
    }
  }, [isActive, ref]);
};
