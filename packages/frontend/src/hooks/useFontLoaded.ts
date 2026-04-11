import { useEffect, useState } from 'react';

const FONT_FAMILY = 'Inter';

export const useFontLoaded = () => {
  const [isFontLoaded, setIsFontLoaded] = useState(() =>
    document.fonts.check(`16px "${FONT_FAMILY}"`),
  );

  useEffect(() => {
    if (isFontLoaded) {
      return;
    }

    let cancelled = false;

    document.fonts.ready.then(() => {
      if (!cancelled) {
        setIsFontLoaded(document.fonts.check(`16px "${FONT_FAMILY}"`));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isFontLoaded]);

  return isFontLoaded;
};
