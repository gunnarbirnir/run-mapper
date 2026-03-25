import { useHotkey, type ConflictBehavior } from '@tanstack/react-hotkeys';
import { useEffect, useState } from 'react';

interface UseFocusedElementHotkeysProps {
  containerRef: React.RefObject<HTMLDivElement>;
  enterEnabled?: boolean;
  escapeEnabled?: boolean;
  forceEnterEnabled?: boolean;
  forceEscapeEnabled?: boolean;
  enterConflictBehavior?: ConflictBehavior;
  escapeConflictBehavior?: ConflictBehavior;
  onEnter?: () => void;
  onEscape?: () => void;
}

export const useFocusedElementHotkeys = ({
  containerRef,
  enterEnabled = false,
  escapeEnabled = false,
  forceEnterEnabled = false,
  forceEscapeEnabled = false,
  enterConflictBehavior = 'allow',
  escapeConflictBehavior = 'allow',
  onEnter = () => {},
  onEscape = () => {},
}: UseFocusedElementHotkeysProps) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleFocusChange = () => {
      setIsFocused(document.activeElement === containerRef.current);
    };

    document.addEventListener('focusin', handleFocusChange);
    document.addEventListener('focusout', handleFocusChange);

    return () => {
      document.removeEventListener('focusin', handleFocusChange);
      document.removeEventListener('focusout', handleFocusChange);
    };
  }, [containerRef]);

  useHotkey('Space', onEnter, {
    enabled: (enterEnabled && isFocused) || forceEnterEnabled,
    conflictBehavior: enterConflictBehavior,
  });

  useHotkey('Enter', onEnter, {
    enabled: (enterEnabled && isFocused) || forceEnterEnabled,
    conflictBehavior: enterConflictBehavior,
  });

  useHotkey('Escape', onEscape, {
    enabled: (escapeEnabled && isFocused) || forceEscapeEnabled,
    conflictBehavior: escapeConflictBehavior,
  });

  return { isFocused };
};
