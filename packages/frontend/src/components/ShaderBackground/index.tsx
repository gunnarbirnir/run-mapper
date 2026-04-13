import { memo, useState, useEffect } from 'react';
import { Shader, ContourLines, FlowingGradient } from 'shaders/react';

import { cn } from '~/utils';

interface ShaderBackgroundProps {
  color?: string;
  speed?: number;
  seed?: number;
  className?: string;
}

const DEFAULT_LINE_WIDTH = 2;

const getSeedValue = (seed?: number) => {
  return seed ?? Math.round(Math.random() * 100);
};

export const ShaderBackground = memo(
  ({
    color = '#ff1180',
    speed = 0.5,
    seed,
    className,
  }: ShaderBackgroundProps) => {
    const [seedValue, setSeedValue] = useState(() => getSeedValue(seed));
    const [lineWidth, setLineWidth] = useState(DEFAULT_LINE_WIDTH);
    const colorTransparent = `${color}00`;
    const colorOpaque = `${color}ff`;

    useEffect(() => {
      setSeedValue(getSeedValue(seed));
    }, [seed]);

    useEffect(() => {
      setLineWidth(window?.devicePixelRatio ?? DEFAULT_LINE_WIDTH);
    }, []);

    return (
      <div className={cn('bg-white opacity-50', className)}>
        <Shader style={{ width: '100%', height: '100%' }}>
          <ContourLines
            source="alpha"
            visible={true}
            levels={5}
            lineWidth={lineWidth}
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
