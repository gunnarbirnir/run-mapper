import { Text } from '~/primitives';
import { cn } from '~/utils';

interface FooterProps {
  isFullWidth: boolean;
  hasShadow: boolean;
}

export const Footer = ({ isFullWidth, hasShadow }: FooterProps) => {
  return (
    <footer className={'relative z-5 bg-gray-200 px-6 pt-4 pb-5'}>
      {hasShadow && <div className="absolute inset-0 rotate-180 shadow-sm" />}
      <div
        className={cn('relative flex items-center justify-between gap-6', {
          'container mx-auto': !isFullWidth,
        })}
      >
        <Text className="whitespace-nowrap text-gray-600">
          Spretta © {new Date().getFullYear()}
        </Text>
        <Text className="text-gray-600">contact@spretta.fit</Text>
      </div>
    </footer>
  );
};
