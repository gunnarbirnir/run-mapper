import { memo, useState, useEffect, useRef } from 'react';
import { Shader, ContourLines, FlowingGradient } from 'shaders/react';

import { useElementSize } from '~/hooks/useElementSize';

interface ShaderBackgroundProps {
  color?: string;
  speed?: number;
  seed?: number;
  lineWidth?: number;
  className?: string;
}

const SCALE_DOWN_MAX_WIDTH = 800;
const SCALE_DOWN_FACTOR = 2;

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
    const colorTransparent = `${color}00`;
    const colorOpaque = `${color}ff`;

    useEffect(() => {
      setSeedValue(getSeedValue(seed));
    }, [seed]);

    useEffect(() => {
      setDevicePixelRatio(window?.devicePixelRatio || 1);
    }, []);

    if (devicePixelRatio === null) {
      return null;
    }

    const scaleDownResolution =
      devicePixelRatio > 1 && width > SCALE_DOWN_MAX_WIDTH;
    const scaleFactor = scaleDownResolution ? SCALE_DOWN_FACTOR : 1;
    const shaderSize = `${100 / scaleFactor}%`;
    const lineWidthValue = (lineWidth * devicePixelRatio) / scaleFactor;

    return (
      <div ref={ref} className={className}>
        <div className="h-full w-full">
          {width > 0 && (
            <Shader
              style={{
                height: shaderSize,
                width: shaderSize,
                transform: `scale(${scaleFactor})`,
              }}
              className="origin-top-left"
            >
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
          )}
        </div>
      </div>
    );
  },
);
