import React, { useState } from 'react';

interface AnimalInputProps {
  onSubmit: (animal: string) => void;
  onRetake: () => void;
  previewImage: string;
}

export const AnimalInput: React.FC<AnimalInputProps> = ({ onSubmit, onRetake, previewImage }) => {
  const [animal, setAnimal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (animal.trim()) {
      onSubmit(animal.trim());
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center animate-fade-in">
      
      {/* Captured Image Preview */}
      <div className="w-full md:w-1/2 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
            <img src={previewImage} alt="You" className="w-full h-full object-cover opacity-80" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            
            <button 
                onClick={onRetake}
                className="absolute top-4 left-4 flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition-colors uppercase tracking-wider"
            >
                ← Retake Scan
            </button>
            <div className="absolute bottom-4 left-4">
                <p className="text-indigo-400 text-xs font-mono mb-1">SUBJECT ACQUIRED</p>
                <p className="text-white text-lg font-bold">Original Form</p>
            </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="w-full md:w-1/2 space-y-8 p-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Choose Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Spirit Animal</span>
          </h2>
          <p className="text-slate-400 text-lg">
            We will reshape your atoms into this creature.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
             <input
                type="text"
                value={animal}
                onChange={(e) => setAnimal(e.target.value)}
                placeholder="e.g. Majestic Lion, Cosmic Owl..."
                className="w-full bg-white/5 border border-white/10 text-white text-xl px-6 py-6 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-slate-600 transition-all font-light"
                autoFocus
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-600 text-sm font-mono pointer-events-none">
                INPUT_REQ
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!animal.trim()}
            className="w-full group relative overflow-hidden bg-white text-black font-bold py-5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 text-lg tracking-wide group-hover:text-indigo-900 transition-colors">INITIATE METAMORPHOSIS</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </form>
      </div>
    </div>
  );
};