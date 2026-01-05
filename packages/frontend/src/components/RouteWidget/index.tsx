import type { PropsWithChildren } from 'react';

const WIDGET_WIDTH = 150;
const WIDGET_HEIGHT = 80;

export const RouteWidget = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="flex items-center justify-center rounded-lg bg-white p-4 shadow-md"
      style={{ width: WIDGET_WIDTH, height: WIDGET_HEIGHT }}
    >
      {children}
    </div>
  );
};
