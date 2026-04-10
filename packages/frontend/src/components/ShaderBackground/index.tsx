import { memo, useState, useEffect } from 'react';
import { Shader, ContourLines, FlowingGradient } from 'shaders/react';

import { cn } from '~/utils';

interface ShaderBackgroundProps {
  color?: string;
  speed?: number;
  seed?: number;
  className?: string;
}

const getSeedValue = (seed?: number) => {
  return seed ?? Math.random() * 100;
};

export const ShaderBackground = memo(
  ({
    color = '#f83b80',
    speed = 0.5,
    seed,
    className,
  }: ShaderBackgroundProps) => {
    const [seedValue, setSeedValue] = useState(() => getSeedValue(seed));
    const colorTransparent = `${color}00`;
    const colorOpaque = `${color}ff`;

    useEffect(() => {
      setSeedValue(getSeedValue(seed));
    }, [seed]);

    return (
      <div className={cn('bg-white opacity-50', className)}>
        <Shader style={{ width: '100%', height: '100%' }}>
          <ContourLines source="alpha" visible={true}>
            <FlowingGradient
              seed={seedValue}
              speed={speed}
              distortion={0}
              colorSpace="linear"
              colorA={colorOpaque}
              colorB={colorTransparent}
              colorC={colorTransparent}
              colorD={colorTransparent}
            />
          </ContourLines>
        </Shader>
      </div>
    );
  },
);
