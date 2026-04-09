import type { ReactNode } from 'react';

import { cn } from '~/utils';
import { LoadingSpinner } from '~/primitives';

import { NavBar } from './NavBar';
import { Footer } from './Footer';

interface PageLayoutProps {
  children?: ReactNode;
  isFullscreenDisplay?: boolean;
  hideNavBar?: boolean;
  hideFooter?: boolean;
  isLoading?: boolean;
  className?: string;
}

const PageLayout = ({
  children,
  isFullscreenDisplay = false,
  hideNavBar = false,
  hideFooter = false,
  isLoading = false,
  className,
}: PageLayoutProps) => {
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner className="text-primary-500 size-10" />
      </div>
    );
  }

  if (isFullscreenDisplay) {
    return (
      <div className="relative h-screen w-screen" style={{ height: '100dvh' }}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn('relative flex min-h-screen flex-col', className)}
      style={{ minHeight: '100dvh' }}
    >
      {!hideNavBar && <NavBar />}
      {children}
      {!hideFooter && <Footer />}
    </div>
  );
};

const MainContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <main className={cn('flex-1 px-4 pt-6 pb-12', className)}>
      <div className="relative container mx-auto">{children}</div>
    </main>
  );
};

PageLayout.MainContent = MainContent;

export { PageLayout };
