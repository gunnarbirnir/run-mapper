import { createFileRoute } from '@tanstack/react-router';

import { PageLayout } from '~/components/PageLayout';
import { RunEditor } from '~/components/RunEditor';

export const Route = createFileRoute('/editor/run/new')({
  component: NewRunEditor,
});

function NewRunEditor() {
  return (
    <PageLayout isFullWidth>
      <RunEditor />
    </PageLayout>
  );
}
