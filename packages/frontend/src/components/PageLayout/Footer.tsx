import { Text } from '~/primitives';
import { cn } from '~/utils';

interface FooterProps {
  isFullWidth: boolean;
}

export const Footer = ({ isFullWidth }: FooterProps) => {
  return (
    <footer
      className={cn('relative bg-gray-200 p-4 pb-5', { 'px-6': isFullWidth })}
    >
      <div
        className={cn('flex items-center justify-between', {
          'container mx-auto': !isFullWidth,
        })}
      >
        <Text className="text-gray-600">
          Spretta © {new Date().getFullYear()}
        </Text>
        <Text className="text-gray-600">contact@spretta.fit</Text>
      </div>
    </footer>
  );
};
