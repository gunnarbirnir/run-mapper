import { memo, useState, useEffect, useRef } from 'react';

import { useElementSize } from '~/hooks/useElementSize';

import { Shader } from './Shader';

interface ShaderBackgroundProps {
  color?: string;
  speed?: number;
  seed?: number;
  lineWidth?: number;
  className?: string;
}

const getSeedValue = (seed?: number) => {
  return seed ?? Math.round(Math.random() * 100);
};

export const ShaderBackground = memo(
  ({
    color = '#ffa2c0',
    speed = 0.5,
    seed,
    lineWidth = 2,
    className,
  }: ShaderBackgroundProps) => {
    const [seedValue, setSeedValue] = useState(() => getSeedValue(seed));
    const [devicePixelRatio, setDevicePixelRatio] = useState<number | null>(
      null,
    );
    const ref = useRef<HTMLDivElement>(null);
    const { width } = useElementSize(ref, [devicePixelRatio]);

    useEffect(() => {
      setSeedValue(getSeedValue(seed));
    }, [seed]);

    useEffect(() => {
      setDevicePixelRatio(window?.devicePixelRatio || 1);
    }, []);

    if (devicePixelRatio === null) {
      return null;
    }

    return (
      <div ref={ref} className={className}>
        <div className="h-full w-full">
          {width > 0 && (
            <Shader
              color={color}
              speed={speed}
              seed={seedValue}
              containerWidth={width}
              lineWidth={lineWidth}
            />
          )}
        </div>
      </div>
    );
  },
);
