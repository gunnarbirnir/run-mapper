import { createContext, useId as useReactId } from 'react';

export const IdContext = createContext<string | null>(null);

export const IdProvider = ({
  baseId,
  children,
}: {
  baseId?: string;
  children: React.ReactNode;
}) => {
  const reactId = useReactId();

  return (
    <IdContext.Provider value={baseId ? `${reactId}-${baseId}` : reactId}>
      {children}
    </IdContext.Provider>
  );
};
