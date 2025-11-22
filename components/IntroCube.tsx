import React from 'react';

interface IntroCubeProps {
  onClick: () => void;
}

export const IntroCube: React.FC<IntroCubeProps> = ({ onClick }) => {
  return (
    <div className="scene w-[120px] h-[120px]" onClick={onClick}>
      <div className="cube">
        <div className="cube-face cube-face--front">
          <div className="w-16 h-16 border border-cyan-400/30 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          </div>
        </div>
        <div className="cube-face cube-face--back"></div>
        <div className="cube-face cube-face--right"></div>
        <div className="cube-face cube-face--left"></div>
        <div className="cube-face cube-face--top"></div>
        <div className="cube-face cube-face--bottom"></div>
      </div>
    </div>
  );
};