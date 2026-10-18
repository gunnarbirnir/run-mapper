import { useEffect } from 'react';

import { formatDocumentTitle } from '~/utils';

export const useSetDocumentTitle = (
  title: string | undefined,
  formatted = true,
) => {
  useEffect(() => {
    if (title) {
      document.title = formatted ? formatDocumentTitle(title) : title;
    }
  }, [title, formatted]);
};
