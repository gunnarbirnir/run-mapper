import { useHotkey } from '@tanstack/react-hotkeys';

interface UseMapHotKeysProps {
  routeIsAnimating: boolean;
  isAtInitialBounds: boolean;
  isFullscreen: boolean;
  playRoute: () => void;
  resetRoute: () => void;
  openFullscreen: () => void;
}

export const useMapHotKeys = ({
  // routeIsAnimating,
  isAtInitialBounds,
  isFullscreen,
  // playRoute,
  resetRoute,
  openFullscreen,
}: UseMapHotKeysProps) => {
  /* useHotkey('P', playRoute, {
    enabled: !routeIsAnimating,
  }); */
  useHotkey('R', resetRoute, {
    enabled: !isAtInitialBounds,
  });
  useHotkey('F', openFullscreen, {
    enabled: !isFullscreen,
  });
};
