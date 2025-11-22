import React, { useState, useEffect } from 'react';
import { AppStep, AppState } from './types';
import { CameraCapture } from './components/CameraCapture';
import { AnimalInput } from './components/AnimalInput';
import { Loading } from './components/Loading';
import { ResultView } from './components/ResultView';
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
    <div className="relative min-h-screen bg-black text-white overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[128px]" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-blue-900/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex flex-col md:flex-row justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex flex-col md:items-start items-center">
          <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">ANIMORPH</span>
            <span className="text-white">MOJI</span>
          </h1>
          <span className="text-[10px] tracking-[0.2em] uppercase text-indigo-400 font-bold mt-1">
            Animal Transformer
          </span>
        </div>
        <div className="mt-2 md:mt-0 flex items-center gap-3 bg-white/5 rounded-full px-4 py-1 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-medium text-slate-300">AI Engineering World's Fair NYC</span>
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
          <div className="flex flex-col items-center justify-center max-w-2xl text-center space-y-10 mt-10 animate-fade-in">
             <div className="space-y-4">
               <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
                 <span className="block text-white">REVEAL YOUR</span>
                 <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                   TRUE FORM
                 </span>
               </h2>
               <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
                 Experience the power of <span className="text-white font-semibold">Gemini 2.5 Flash</span> and <span className="text-white font-semibold">Veo</span>.
                 Transform into your spirit animal with a cinematic video transition.
               </p>
             </div>
             
             <div className="glass-panel p-1 rounded-full">
               <button
                onClick={handleAuthClick}
                className="bg-white hover:bg-slate-200 text-black font-bold text-lg py-4 px-12 rounded-full transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] hover:scale-105"
              >
                Enter Experience
              </button>
             </div>

             <div className="flex flex-col items-center space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-widest">Powered By</p>
                <div className="flex gap-4 text-slate-400 text-sm font-semibold">
                    <span>Google Gemini</span>
                    <span className="text-slate-700">•</span>
                    <span>Google Veo</span>
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
            message={`ANALYZING ${state.animal.toUpperCase()} DNA`} 
            subMessage="Gemini Nano is reconstructing your features..."
          />
        )}

        {state.step === AppStep.PROCESSING_VIDEO && (
          <Loading 
            message="GENERATING METAMORPHOSIS" 
            subMessage="Veo is rendering the transition frames..."
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
        <p className="text-[10px] text-white/10 uppercase tracking-[0.3em]">AI Engineering World's Fair • New York City</p>
      </footer>
    </div>
  );
};

export default App;