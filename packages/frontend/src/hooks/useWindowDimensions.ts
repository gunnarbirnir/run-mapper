import { useState, useEffect } from 'react';

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;

  return { width, height };
};

export const useWindowDimensions = () => {
  const isClient = Boolean(window);
  const [windowDimensions, setWindowDimensions] = useState(() =>
    isClient ? getWindowDimensions() : { width: 0, height: 0 },
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    if (!isClient) {
      return;
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);

  return windowDimensions;
};
