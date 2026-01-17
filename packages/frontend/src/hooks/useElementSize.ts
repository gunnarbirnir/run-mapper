import { useCallback, useEffect, useState } from 'react';

export const useElementSize = (ref: React.RefObject<HTMLElement>) => {
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleResize();
  }, [handleResize]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return elementSize;
};
