import React, { useEffect, useRef } from 'react';

interface ResultViewProps {
  originalImage: string;
  modifiedImage: string;
  videoUrl: string;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ originalImage, modifiedImage, videoUrl, onReset }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay blocked", e));
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-mono tracking-widest uppercase mb-2">
            System Status: Complete
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300">
          TRANSFORMATION COMPLETE
        </h2>
      </div>

      {/* Hero Video Section */}
      <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-indigo-500/50 group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 pointer-events-none"></div>
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain relative z-0"
          controls
          loop
          playsInline
        />
        <div className="absolute bottom-6 left-6 z-20">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-500 block rounded-full"></span>
                The Morph
            </h3>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Source */}
        <div className="glass-panel p-4 rounded-2xl space-y-4">
            <div className="flex justify-between items-center text-sm text-slate-400 font-mono">
                <span>SOURCE_DATA</span>
                <span>ORIGINAL</span>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-xl relative">
                <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-indigo-900/10 mix-blend-overlay"></div>
            </div>
        </div>

        {/* Output */}
        <div className="glass-panel p-4 rounded-2xl space-y-4 border-indigo-500/30">
            <div className="flex justify-between items-center text-sm text-indigo-300 font-mono">
                <span>GENERATED_ASSET</span>
                <span>TRANSFORMED</span>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-xl relative">
                <img src={modifiedImage} alt="Modified" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay"></div>
            </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-white/20 blur-md"></div>
          <span className="relative text-white font-bold tracking-wider flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            RESTART SEQUENCE
          </span>
        </button>
      </div>
    </div>
  );
};