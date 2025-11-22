import React, { useRef, useEffect, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            aspectRatio: 16 / 9,
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Unable to access camera. Please ensure permissions are granted.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageData);
      }
    }
  };

  if (error) {
    return <div className="text-red-400 text-center p-8 glass-panel rounded-xl">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-4xl mx-auto animate-fade-in">
      <div className="text-center space-y-1 mb-2">
        <h2 className="text-xl font-bold tracking-tight text-white">Identity Scan</h2>
        <p className="text-slate-400 text-sm">Align your face within the frame</p>
      </div>

      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-indigo-500/30 group">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover transform -scale-x-100 opacity-90"
        />
        
        {/* HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Corners */}
            <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-indigo-400/80"></div>
            <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-indigo-400/80"></div>
            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-indigo-400/80"></div>
            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-indigo-400/80"></div>

            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                 <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                 </div>
            </div>

            {/* Scanning Scanline */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent h-1/4 animate-[scan_3s_ease-in-out_infinite]"></div>

            {/* Tech Text */}
            <div className="absolute top-8 left-10 text-[10px] text-indigo-300 font-mono">
                REC :: HD <span className="animate-pulse">●</span>
            </div>
            <div className="absolute bottom-8 right-10 text-[10px] text-indigo-300 font-mono">
                FACE_DETECT: ACTIVE
            </div>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />

      <button
        onClick={handleCapture}
        className="group relative inline-flex items-center justify-center"
        aria-label="Capture Identity"
      >
         <div className="absolute -inset-3 rounded-full bg-indigo-600 opacity-20 group-hover:opacity-40 blur-lg transition duration-200" />
         <div className="relative h-20 w-20 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center transition-all group-hover:scale-105 group-active:scale-95">
            <div className="h-16 w-16 rounded-full bg-white transition-colors group-hover:bg-indigo-50"></div>
         </div>
      </button>
    </div>
  );
};