import { Shader, Swirl } from 'shaders/react';

export const SwirlBackground = () => {
  return (
    <div className="absolute inset-0 opacity-50">
      <Shader style={{ width: '100%', height: '100%' }}>
        <Swirl colorA="#FE6E9F" colorB="#FFC9DA" detail={0.8} speed={0.8} />
      </Shader>
    </div>
  );
};
