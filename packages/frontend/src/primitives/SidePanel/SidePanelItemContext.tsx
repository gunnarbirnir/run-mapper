import { createContext, useContext, type ReactNode } from 'react';

interface SidePanelItemContextValue {
  hideCloseButton: boolean;
}

const SidePanelItemContext = createContext<SidePanelItemContextValue>({
  hideCloseButton: false,
});

type SidePanelItemProviderProps = SidePanelItemContextValue & {
  children: ReactNode;
};

export const SidePanelItemProvider = ({
  hideCloseButton,
  children,
}: SidePanelItemProviderProps) => {
  return (
    <SidePanelItemContext.Provider value={{ hideCloseButton }}>
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
