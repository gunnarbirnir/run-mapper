import type { Map } from 'mapbox-gl';
import { RefObject, useEffect, useRef } from 'react';

interface UseResizeMapProps {
  isAnyPanelAnimating: boolean;
  isMapLoaded: boolean;
  mapRef: RefObject<Map>;
}

// resize() clears the WebGL buffer by assigning canvas width/height, then
// schedules the redraw for a later frame. Draw immediately so the browser
// does not paint that cleared frame.
const resizeAndDraw = (map: Map) => {
  const canvas = map.getCanvas();
  const { width, height } = map.getContainer().getBoundingClientRect();
  const sizeChanged =
    Number.parseFloat(canvas.style.width) !== width ||
    Number.parseFloat(canvas.style.height) !== height;

  map.resize();

  if (sizeChanged) {
    map._render(performance.now());
  }
};

export const useResizeMap = ({
  isAnyPanelAnimating,
  isMapLoaded,
  mapRef,
}: UseResizeMapProps) => {
  const wasAnimatingRef = useRef(false);

  useEffect(() => {
    const map = mapRef.current;
    if (!isMapLoaded || !map) {
      return;
    }

    if (!isAnyPanelAnimating) {
      if (wasAnimatingRef.current) {
        wasAnimatingRef.current = false;
        // Catch the final container size if the last animation frame was cancelled.
        resizeAndDraw(map);
      }
      return;
    }

    wasAnimatingRef.current = true;
    let frameId = 0;

    const resizeLoop = () => {
      if (mapRef.current) {
        resizeAndDraw(mapRef.current);
      }
      frameId = requestAnimationFrame(resizeLoop);
    };

    frameId = requestAnimationFrame(resizeLoop);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isMapLoaded, isAnyPanelAnimating, mapRef]);
};
