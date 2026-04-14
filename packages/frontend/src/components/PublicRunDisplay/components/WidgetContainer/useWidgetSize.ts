import { useCallback, useEffect, useState, type SetStateAction } from 'react';

import { useElevationGraphHeight } from '~/hooks/useElevationGraphHeight';
import { useFontLoaded } from '~/hooks/useFontLoaded';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { spacingPx } from '~/utils';

const MODAL_MAX_HEIGHT = 300;
const MODAL_MAX_WIDTH = 600;

interface UseWidgetSizeProps {
  index: number;
  text?: string;
  isOpen: boolean;
  showGraphWhileActive: boolean;
  widgetSizes: number[];
  publicRunDisplaySize: {
    width: number;
    height: number;
  };
  widgetRef: React.RefObject<HTMLDivElement>;
  setWidgetSizes: (sizes: SetStateAction<number[]>) => void;
}

export const useWidgetSize = ({
  index,
  text,
  isOpen,
  showGraphWhileActive,
  widgetSizes,
  publicRunDisplaySize,
  widgetRef,
  setWidgetSizes,
}: UseWidgetSizeProps) => {
  const { isSmallScreen } = useMediaQuery();
  const { expandedHeight: graphHeight } = useElevationGraphHeight();
  const isFontLoaded = useFontLoaded();
  const [isInitialized, setIsInitialized] = useState(false);

  const widgetWidth = widgetSizes[index];
  const widgetHeight = spacingPx(10);
  const activeSpacing = isSmallScreen ? spacingPx(4) : spacingPx(8);
  const baseSpacing = spacingPx(3);
  const top = isSmallScreen
    ? baseSpacing +
      widgetSizes
        .slice(0, index)
        .reduce((acc, size) => acc + (size ? widgetHeight + baseSpacing : 0), 0)
    : baseSpacing;
  const left = isSmallScreen
    ? baseSpacing
    : baseSpacing +
      widgetSizes
        .slice(0, index)
        .reduce((acc, size) => acc + (size ? size + baseSpacing : 0), 0);

  const mapHeight =
    publicRunDisplaySize.height - (showGraphWhileActive ? graphHeight : 0);
  const modalTargetHeight = mapHeight - activeSpacing * 2;
  const modalTargetWidth = publicRunDisplaySize.width - activeSpacing * 2;
  const modalTop =
    modalTargetHeight > MODAL_MAX_HEIGHT
      ? (mapHeight - MODAL_MAX_HEIGHT) / 2
      : activeSpacing;
  const modalLeft =
    modalTargetWidth > MODAL_MAX_WIDTH
      ? (publicRunDisplaySize.width - MODAL_MAX_WIDTH) / 2
      : activeSpacing;
  const modalWidth = Math.min(modalTargetWidth, MODAL_MAX_WIDTH);
  const modalHeight = Math.min(modalTargetHeight, MODAL_MAX_HEIGHT);

  const updateWidgetSize = useCallback(
    (newSize: number) => {
      setWidgetSizes((prev) => {
        const newSizes = [...prev];
        newSizes[index] = newSize;
        return newSizes;
      });
    },
    [index, setWidgetSizes],
  );

  // Reset size when component is hidden
  useEffect(() => {
    return () => {
      updateWidgetSize(0);
    };
  }, [updateWidgetSize]);

  // Reset state when content changes
  useEffect(() => {
    updateWidgetSize(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsInitialized(false);
  }, [updateWidgetSize, setIsInitialized, text]);

  // Calculate widget size when not expanded
  useEffect(() => {
    if (!isOpen && !isInitialized && isFontLoaded) {
      const newSize = widgetRef.current ? widgetRef.current.offsetWidth : 0;
      updateWidgetSize(newSize);
    }
  }, [widgetRef, isOpen, isInitialized, updateWidgetSize, isFontLoaded]);

  // Initialize widget when size is known
  useEffect(() => {
    if (!isInitialized && widgetWidth > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsInitialized(true);
    }
  }, [isInitialized, widgetWidth]);

  return {
    top,
    left,
    widgetWidth,
    widgetHeight,
    modalTop,
    modalLeft,
    modalWidth,
    modalHeight,
    isInitialized,
  };
};
