import { memo, useState, useEffect } from 'react';
import { Shader, ContourLines, FlowingGradient } from 'shaders/react';

interface ShaderBackgroundProps {
  color?: string;
  speed?: number;
  seed?: number;
  lineWidth?: number;
  scaleDownByPixelRatio?: boolean;
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
    // Recommended for full screen animations
    scaleDownByPixelRatio = false,
    className,
  }: ShaderBackgroundProps) => {
    const [seedValue, setSeedValue] = useState(() => getSeedValue(seed));
    const [devicePixelRatio, setDevicePixelRatio] = useState<number | null>(
      null,
    );
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

    const scaleValue = scaleDownByPixelRatio ? devicePixelRatio : 1;
    const scaleDownPercent = `${100 / scaleValue}%`;
    const lineWidthValue = scaleDownByPixelRatio
      ? lineWidth
      : lineWidth * devicePixelRatio;

    return (
      <div className={className}>
        <div className="h-full w-full">
          <Shader
            style={{
              height: scaleDownPercent,
              width: scaleDownPercent,
              transform: `scale(${scaleValue})`,
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
        </div>
      </div>
    );
  },
);
