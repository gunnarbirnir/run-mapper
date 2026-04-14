import { memo, useState, useEffect } from 'react';
import { Shader, ContourLines, FlowingGradient } from 'shaders/react';

import { cn } from '~/utils';

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
    color = '#ff1180',
    speed = 0.5,
    seed,
    lineWidth = 2,
    className,
  }: ShaderBackgroundProps) => {
    const [seedValue, setSeedValue] = useState(() => getSeedValue(seed));
    const [lineWidthValue, setLineWidthValue] = useState<number | null>(null);
    const colorTransparent = `${color}00`;
    const colorOpaque = `${color}ff`;

    useEffect(() => {
      setSeedValue(getSeedValue(seed));
    }, [seed]);

    useEffect(() => {
      const devicePixelRatio = window?.devicePixelRatio ?? 1;
      setLineWidthValue(lineWidth * devicePixelRatio);
    }, [lineWidth]);

    if (lineWidthValue === null) {
      return null;
    }

    return (
      <div className={cn('bg-white opacity-50', className)}>
        <Shader style={{ width: '100%', height: '100%' }}>
          <ContourLines
            source="alpha"
            visible={true}
            levels={5}
            lineWidth={lineWidthValue}
            softness={0.5}
          >
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
