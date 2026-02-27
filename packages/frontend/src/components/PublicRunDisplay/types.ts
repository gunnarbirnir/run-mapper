import type { Run } from '~/types';

export interface PublicRunDisplayProps {
  routeId: string;
  run: Run;
  isFullscreen?: boolean;
}
