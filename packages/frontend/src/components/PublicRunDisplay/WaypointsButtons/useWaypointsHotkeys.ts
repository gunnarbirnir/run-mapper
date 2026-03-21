import { useHotkey } from '@tanstack/react-hotkeys';

interface UseWaypointsHotkeysProps {
  nextDisabled: boolean;
  previousDisabled: boolean;
  goToPreviousWaypoint: () => void;
  goToNextWaypoint: () => void;
  resetState: () => void;
}

export const useWaypointsHotkeys = ({
  nextDisabled,
  previousDisabled,
  goToPreviousWaypoint,
  goToNextWaypoint,
  resetState,
}: UseWaypointsHotkeysProps) => {
  useHotkey('ArrowLeft', goToPreviousWaypoint, {
    enabled: !previousDisabled,
  });

  useHotkey('ArrowRight', goToNextWaypoint, {
    enabled: !nextDisabled,
  });

  useHotkey('Escape', resetState, {
    enabled: true,
    conflictBehavior: 'allow',
  });
};
