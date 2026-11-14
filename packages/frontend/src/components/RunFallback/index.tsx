import { PageLayout } from '~/components/PageLayout';
import { Text } from '~/primitives';

export const RunFallback = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageLayout isFullscreenDisplay>
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 p-6">
        {children}
      </div>
    </PageLayout>
  );
};

export const RunErrorMessage = ({ message }: { message: string }) => {
  return (
    <RunFallback>
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <Text
          element="h1"
          className="text-primary-500 font-4xl mb-0 text-4xl font-extrabold"
        >
          Error
        </Text>
        <Text variant="paragraph">{message}</Text>
      </div>
    </RunFallback>
  );
};
