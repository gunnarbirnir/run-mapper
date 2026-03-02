import { Text } from '~/primitives';
import { PageLayout } from '~/components/PageLayout';

export function Home() {
  return (
    <PageLayout>
      <PageLayout.MainContent>
        <Text element="h1">Spretta</Text>
        <div className="mb-8 max-w-2xl">
          <Text variant="paragraph">
            Visualize your running routes on interactive maps with elevation
            profiles, distance tracking, and animated playback. Share your runs
            with a single link.
          </Text>
          <Text variant="paragraph">Here is a demo of the app:</Text>
        </div>
        <div className="flex justify-center">
          <iframe
            height="700"
            style={{ width: '100%' }}
            src={`${import.meta.env.VITE_FRONTEND_BASE_URL}/run/hauganes-marathon`}
          />
        </div>
      </PageLayout.MainContent>
    </PageLayout>
  );
}
