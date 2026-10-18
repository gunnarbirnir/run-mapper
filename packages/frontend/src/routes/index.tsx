import { createFileRoute } from '@tanstack/react-router';

import { Home } from '~/components/Home';
import { formatDocumentTitle } from '~/utils';

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [{ title: formatDocumentTitle('Home') }],
  }),
});
