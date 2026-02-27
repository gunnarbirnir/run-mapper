import { Text } from '~/primitives';

export const SectionLabel = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text element="label" className="mt-4 mb-2 whitespace-nowrap">
      {children}
    </Text>
  );
};
