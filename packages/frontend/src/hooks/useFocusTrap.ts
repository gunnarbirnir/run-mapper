import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement;

    const focusableElements = () => {
      return Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
    };

    // Focus the first element when the trap activates
    focusableElements()[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {
        return;
      }

      const elements = focusableElements();
      if (elements.length === 0) {
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    const inertElements: HTMLElement[] = [];
    let ancestor = container.parentElement;

    while (ancestor && ancestor !== document.body) {
      for (const sibling of Array.from(
        ancestor.parentElement?.children ?? [],
      )) {
        if (
          sibling instanceof HTMLElement &&
          sibling !== ancestor &&
          !sibling.hasAttribute('inert')
        ) {
          sibling.setAttribute('inert', '');
          inertElements.push(sibling);
        }
      }
      ancestor = ancestor.parentElement;
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      inertElements.forEach((el) => el.removeAttribute('inert'));
      previouslyFocused?.focus();
    };
  }, [isActive]);

  return containerRef;
};
