import { type ReactNode } from 'react';

import { useMediaQuery } from '~/hooks/useMediaQuery';

interface TouchableAreaProps {
  children: ReactNode;
  touchablePadding?: number;
}

export const TouchableArea = ({
  children,
  touchablePadding,
}: TouchableAreaProps) => {
  const { isSmallScreen } = useMediaQuery();

  return (
    <>
      {children}
      {touchablePadding && isSmallScreen ? (
        <div
          className="absolute rounded-full"
          style={{ inset: -touchablePadding }}
        />
      ) : null}
    </>
  );
};
