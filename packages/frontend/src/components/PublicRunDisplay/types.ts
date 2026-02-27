import type { PublicRun } from '~/types';

export interface PublicRunDisplayProps {
  routeId: string;
  run: PublicRun;
  isFullscreen?: boolean;
}
