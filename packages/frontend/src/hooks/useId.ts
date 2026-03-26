import { useContext, useMemo } from 'react';

import { IdContext } from '~/context/IdContext';

export const useId = (id: string) => {
  const baseId = useContext(IdContext);

  if (baseId === null) {
    throw new Error('useId must be used within an IdContext provider');
  }

  return useMemo(() => `${baseId}-${id}`, [baseId, id]);
};
