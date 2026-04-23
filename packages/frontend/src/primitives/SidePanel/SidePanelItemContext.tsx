import { createContext, useContext, type ReactNode } from 'react';

interface SidePanelItemContextValue {
  itemId: string;
  isTopVisibleItem: boolean;
  isAnyAnimating: boolean;
}

const SidePanelItemContext = createContext<SidePanelItemContextValue>({
  itemId: '',
  isTopVisibleItem: false,
  isAnyAnimating: false,
});

type SidePanelItemProviderProps = SidePanelItemContextValue & {
  children: ReactNode;
};

export const SidePanelItemProvider = ({
  children,
  ...value
}: SidePanelItemProviderProps) => {
  return (
    <SidePanelItemContext.Provider value={value}>
      {children}
    </SidePanelItemContext.Provider>
  );
};

export const useSidePanelItemContext = () => {
  const context = useContext(SidePanelItemContext);

  if (context === undefined) {
    throw new Error(
      'useSidePanelItemContext must be used within a SidePanelItemProvider',
    );
  }

  return context;
};
