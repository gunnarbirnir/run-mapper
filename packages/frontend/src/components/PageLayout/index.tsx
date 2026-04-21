import type { ReactNode } from 'react';

import { cn } from '~/utils';
import { LoadingSpinner, Text } from '~/primitives';

import { NavBar } from './NavBar';
import { Footer } from './Footer';

interface PageLayoutProps {
  children?: ReactNode;
  isFullWidth?: boolean;
  isFullscreenDisplay?: boolean;
  hideNavBar?: boolean;
  hideFooter?: boolean;
  isLoading?: boolean;
  className?: string;
}

const PageLayout = ({
  children,
  isFullWidth = false,
  isFullscreenDisplay = false,
  hideNavBar = false,
  hideFooter = false,
  isLoading = false,
  className,
}: PageLayoutProps) => {
  const content = isLoading ? (
    <div className="flex h-full flex-1 items-center justify-center">
      <LoadingSpinner className="text-primary-500 size-10" />
    </div>
  ) : (
    children
  );

  if (isFullscreenDisplay) {
    return (
      <div className="relative h-screen w-screen" style={{ height: '100dvh' }}>
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn('relative flex min-h-screen min-w-80 flex-col', className)}
      style={{ minHeight: '100dvh' }}
    >
      {!hideNavBar && <NavBar isFullWidth={isFullWidth} />}
      {content}
      {!hideFooter && <Footer isFullWidth={isFullWidth} />}
    </div>
  );
};

const MainContent = ({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <main className={cn('flex-1 p-6 pb-12', className)}>
      <div className="relative container mx-auto">
        {title && <Text element="h1">{title}</Text>}
        {subtitle && (
          <div className="max-w-2xl">
            <Text variant="paragraph">{subtitle}</Text>
          </div>
        )}
        {children}
      </div>
    </main>
  );
};

const ErrorContent = ({
  title,
  message,
  children,
  className,
}: {
  title?: string;
  message?: string;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <main className={cn('flex-1 p-6 pb-12', className)}>
      <div className="relative container mx-auto">
        {title && <Text element="h1">{title}</Text>}
        {message && (
          <div className="max-w-2xl">
            <Text variant="paragraph">{message}</Text>
          </div>
        )}
        {children}
      </div>
    </main>
  );
};

PageLayout.MainContent = MainContent;
PageLayout.ErrorContent = ErrorContent;

export { PageLayout };
