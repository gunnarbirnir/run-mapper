import {
  Shader as ShaderComponent,
  ContourLines,
  FlowingGradient,
} from 'shaders/react';

import { useMediaQuery } from '~/hooks/useMediaQuery';

interface ShaderProps {
  color: string;
  speed: number;
  seed: number;
  containerWidth: number;
  lineWidth: number;
}

const SCALE_DOWN_MAX_WIDTH = 800;
const SCALE_DOWN_FACTOR = 2;

export const Shader = ({
  color,
  speed,
  seed,
  containerWidth,
  lineWidth,
}: ShaderProps) => {
  const { isSmallScreen } = useMediaQuery();
  const colorTransparent = `${color}00`;
  const colorOpaque = `${color}ff`;

  const scaleDownResolution =
    devicePixelRatio > 1 && containerWidth > SCALE_DOWN_MAX_WIDTH;
  const scaleFactor = scaleDownResolution ? SCALE_DOWN_FACTOR : 1;
  const shaderSize = `${100 / scaleFactor}%`;
  const lineWidthValue = (lineWidth * devicePixelRatio) / scaleFactor;

  return (
    <ShaderComponent
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
        levels={isSmallScreen ? 3 : 5}
        lineWidth={lineWidthValue}
        softness={0.5}
      >
        <FlowingGradient
          seed={seed}
          speed={speed}
          distortion={0}
          colorSpace="linear"
          colorA={colorOpaque}
          colorB={colorTransparent}
          colorC={colorTransparent}
          colorD={colorTransparent}
        />
      </ContourLines>
    </ShaderComponent>
  );
};
