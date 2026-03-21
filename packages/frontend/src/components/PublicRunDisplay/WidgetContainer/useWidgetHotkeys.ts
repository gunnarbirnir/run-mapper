import { useHotkey } from '@tanstack/react-hotkeys';
import { useEffect, useState } from 'react';

interface UseWidgetHotkeysProps {
  isOpen: boolean;
  isClickable: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  toggleActive?: () => void;
}

export const useWidgetHotkeys = ({
  isOpen,
  isClickable,
  containerRef,
  toggleActive = () => {},
}: UseWidgetHotkeysProps) => {
  const [isContainerFocused, setIsContainerFocused] = useState(false);

  useEffect(() => {
    const handleFocusChange = () => {
      setIsContainerFocused(document.activeElement === containerRef.current);
    };

    document.addEventListener('focusin', handleFocusChange);
    document.addEventListener('focusout', handleFocusChange);

    return () => {
      document.removeEventListener('focusin', handleFocusChange);
      document.removeEventListener('focusout', handleFocusChange);
    };
  }, [containerRef]);

  useHotkey('Space', toggleActive, {
    enabled: !isOpen && isClickable && isContainerFocused,
    conflictBehavior: 'allow',
  });

  useHotkey('Enter', toggleActive, {
    enabled: !isOpen && isClickable && isContainerFocused,
    conflictBehavior: 'allow',
  });

  useHotkey('Escape', toggleActive, {
    enabled: isOpen,
    conflictBehavior: 'allow',
  });

  return { isContainerFocused };
};
