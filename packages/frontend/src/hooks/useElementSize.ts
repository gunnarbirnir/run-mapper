import { useCallback, useEffect, useState } from 'react';

export const useElementSize = (
  ref: React.RefObject<HTMLElement>,
  dependencies: unknown[] = [],
) => {
  const isClient = Boolean(window);
  const [elementSize, setElementSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const handleResize = useCallback(() => {
    setElementSize({
      width: ref.current ? ref.current.offsetWidth : 0,
      height: ref.current ? ref.current.offsetHeight : 0,
    });
  }, [ref]);

  useEffect(() => {
    handleResize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleResize, ...dependencies]);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [isClient, handleResize]);

  return elementSize;
};
