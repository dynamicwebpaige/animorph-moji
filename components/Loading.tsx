import React from 'react';

interface LoadingProps {
  message: string;
  subMessage?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message, subMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-fade-in w-full max-w-2xl mx-auto p-8 relative">
       {/* Decorative Grid Background */}
       <div className="absolute inset-0 border border-white/5 rounded-3xl bg-black/40 backdrop-blur-sm -z-10"></div>
       
       <div className="relative">
          {/* Outer Ring */}
          <div className="w-32 h-32 rounded-full border-2 border-indigo-900/50 animate-[spin_3s_linear_infinite]"></div>
          {/* Middle Ring */}
          <div className="absolute top-2 left-2 w-28 h-28 rounded-full border-t-2 border-indigo-500 animate-[spin_2s_linear_infinite_reverse]"></div>
          {/* Inner Pulsing Core */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-indigo-600/20 rounded-full animate-pulse flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
          </div>
       </div>

      <div className="text-center space-y-3 z-10">
        <h3 className="text-2xl font-bold text-white tracking-widest font-mono">{message}</h3>
        {subMessage && (
            <div className="flex flex-col items-center gap-2">
                <p className="text-indigo-300 text-sm font-mono">{subMessage}</p>
                <div className="h-1 w-24 bg-indigo-900/50 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 w-1/3 animate-[shimmer_1s_infinite_linear] rounded-full"></div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};