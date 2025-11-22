import React, { useState, useEffect } from 'react';
import { AppStep, AppState } from './types';
import { CameraCapture } from './components/CameraCapture';
import { AnimalInput } from './components/AnimalInput';
import { Loading } from './components/Loading';
import { ResultView } from './components/ResultView';
import { IntroCube } from './components/IntroCube';
import { checkApiKey, requestApiKeySelection, generateAnimalImage, generateTransitionVideo, fetchVideoBlob } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: AppStep.AUTH_CHECK,
    originalImage: null,
    animal: '',
    modifiedImage: null,
    videoUrl: null,
    error: null,
  });

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const hasKey = await checkApiKey();
        if (hasKey) {
          setState(prev => ({ ...prev, step: AppStep.CAPTURE }));
        }
      } catch (e) {
        console.error("Auth check failed", e);
      }
    };
    verifyAuth();
  }, []);

  const handleAuthClick = async () => {
    try {
      await requestApiKeySelection();
      setState(prev => ({ ...prev, step: AppStep.CAPTURE, error: null }));
    } catch (e) {
      setState(prev => ({ ...prev, error: "Failed to select API key. Please try again." }));
    }
  };

  const handleCapture = (base64Image: string) => {
    setState(prev => ({
      ...prev,
      originalImage: base64Image,
      step: AppStep.INPUT,
    }));
  };

  const handleRetake = () => {
    setState(prev => ({
      ...prev,
      originalImage: null,
      animal: '',
      step: AppStep.CAPTURE,
    }));
  };

  const handleAnimalSubmit = async (animal: string) => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, animal, step: AppStep.PROCESSING_IMAGE }));

    try {
      // 1. Generate Image
      const modifiedImg = await generateAnimalImage(state.originalImage, animal);
      
      setState(prev => ({ 
        ...prev, 
        modifiedImage: modifiedImg, 
        step: AppStep.PROCESSING_VIDEO 
      }));

      // 2. Generate Video
      const videoUri = await generateTransitionVideo(state.originalImage, modifiedImg, animal);
      
      // 3. Fetch Video Blob for display
      const blobUrl = await fetchVideoBlob(videoUri);

      setState(prev => ({ 
        ...prev, 
        videoUrl: blobUrl, 
        step: AppStep.RESULT 
      }));

    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        step: AppStep.ERROR, 
        error: error.message || "Something went wrong during the transformation." 
      }));
    }
  };

  const handleReset = () => {
    setState({
      step: AppStep.CAPTURE,
      originalImage: null,
      animal: '',
      modifiedImage: null,
      videoUrl: null,
      error: null,
    });
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/20 rounded-full blur-[128px]" />
        <div className="absolute top-[30%] left-[50%] transform -translate-x-1/2 w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex flex-col md:flex-row justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex flex-col md:items-start items-center">
          <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 glow-text">ANIMORPH</span>
            <span className="text-white">MOJI</span>
          </h1>
          <span className="text-[10px] tracking-[0.2em] uppercase text-cyan-500 font-bold mt-1">
            Transformation Sequence
          </span>
        </div>
        <div className="mt-2 md:mt-0 flex items-center gap-3 bg-cyan-950/30 rounded-full px-4 py-1 border border-cyan-500/20">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
          <span className="text-xs font-medium text-cyan-200 tracking-wide">AI Engineering World's Fair NYC</span>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 pt-32 pb-12 flex flex-col items-center min-h-screen">
        {state.error && (
          <div className="w-full max-w-md bg-red-950/50 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mb-8 text-center backdrop-blur-md animate-fade-in shadow-xl shadow-red-900/10">
            <p className="font-medium">{state.error}</p>
            <button 
                onClick={() => setState(prev => ({ ...prev, step: AppStep.CAPTURE, error: null }))}
                className="text-sm underline mt-2 hover:text-white transition-colors"
            >
                Reset System
            </button>
          </div>
        )}

        {state.step === AppStep.AUTH_CHECK && (
          <div className="flex flex-col items-center justify-center max-w-4xl text-center space-y-12 mt-4 animate-fade-in">
             
             <div className="relative py-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[60px]"></div>
                <IntroCube onClick={handleAuthClick} />
                <p className="mt-8 text-xs text-cyan-400/60 font-mono tracking-[0.2em] animate-pulse">TOUCH CUBE TO ACQUIRE</p>
             </div>

             <div className="space-y-6 z-10">
               <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
                 <span className="block text-white drop-shadow-2xl">THE INVASION</span>
                 <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 glow-text">
                   HAS BEGUN
                 </span>
               </h2>
               
               <div className="max-w-xl mx-auto space-y-4">
                   <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                     We can't tell you who we are. It's too risky.
                   </p>
                   <p className="text-slate-400">
                     This blue box is an artifact not from this earth. By touching it, you will 
                     acquire the ability to rewrite your DNA and physically morph into any animal.
                   </p>
                   <p className="text-red-400/80 text-sm font-mono border border-red-500/20 bg-red-900/10 p-2 rounded inline-block">
                     WARNING: Never stay in a morph for more than two hours.
                     <br/>Or you will stay that way forever.
                   </p>
               </div>
             </div>
             
             <div>
               <button
                onClick={handleAuthClick}
                className="group relative bg-transparent text-white font-bold text-sm tracking-[0.2em] py-4 px-10 rounded-none border border-cyan-500/30 hover:border-cyan-400 transition-all overflow-hidden"
              >
                <span className="relative z-10">ACQUIRE THE POWER</span>
                <div className="absolute inset-0 bg-cyan-500/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
              </button>
             </div>

             <div className="flex flex-col items-center space-y-2 opacity-60">
                <div className="flex gap-6 text-slate-500 text-xs font-mono uppercase tracking-widest">
                    <span>Class 5 Transformation</span>
                    <span>•</span>
                    <span>Visual Record</span>
                </div>
             </div>
          </div>
        )}

        {state.step === AppStep.CAPTURE && (
          <CameraCapture onCapture={handleCapture} />
        )}

        {state.step === AppStep.INPUT && state.originalImage && (
          <AnimalInput 
            onSubmit={handleAnimalSubmit} 
            onRetake={handleRetake} 
            previewImage={state.originalImage} 
          />
        )}

        {state.step === AppStep.PROCESSING_IMAGE && (
          <Loading 
            message={`REWRITING DNA SEQUENCE: ${state.animal.toUpperCase()}`} 
            subMessage="Calculating biological restructuring..."
          />
        )}

        {state.step === AppStep.PROCESSING_VIDEO && (
          <Loading 
            message="MORPHING IN PROGRESS" 
            subMessage="Generating transformation visualization..."
          />
        )}

        {state.step === AppStep.RESULT && state.originalImage && state.modifiedImage && state.videoUrl && (
          <ResultView
            originalImage={state.originalImage}
            modifiedImage={state.modifiedImage}
            videoUrl={state.videoUrl}
            onReset={handleReset}
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="fixed bottom-4 w-full text-center z-0 pointer-events-none">
        <p className="text-[10px] text-cyan-900/60 uppercase tracking-[0.5em]">NY • AI ENG • WORLD'S FAIR</p>
      </footer>
    </div>
  );
};

export default App;