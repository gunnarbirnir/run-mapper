import { useHotkey } from '@tanstack/react-hotkeys';

interface UseWaypointsHotkeysProps {
  nextDisabled: boolean;
  previousDisabled: boolean;
  goToPreviousWaypoint: () => void;
  goToNextWaypoint: () => void;
  closeWaypointsButtons: () => void;
}

export const useWaypointsHotkeys = ({
  nextDisabled,
  previousDisabled,
  goToPreviousWaypoint,
  goToNextWaypoint,
  closeWaypointsButtons,
}: UseWaypointsHotkeysProps) => {
  useHotkey('ArrowLeft', goToPreviousWaypoint, {
    enabled: !previousDisabled,
  });

  useHotkey('ArrowRight', goToNextWaypoint, {
    enabled: !nextDisabled,
  });

  useHotkey('Escape', closeWaypointsButtons, {
    conflictBehavior: 'allow',
  });
};
