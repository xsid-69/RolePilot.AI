import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContextShared';

const Hero = () => {
  const { user } = useUser();
  const [displayedText, setDisplayedText] = useState({ line1: "", line2: "" });
  const [activeLine, setActiveLine] = useState(1);

  useEffect(() => {
    const firstName = user?.fullName?.firstName || "Anonymous";
    const line1Full = `Hi, ${firstName}`;
    const line2Full = "Can I help you with anything?";
    
    let i = 0;
    let j = 0;
    let timeoutId;

    // Reset state when user changes (or on mount/remount)
    setDisplayedText({ line1: "", line2: "" });
    setActiveLine(1);

    const typeLine1 = () => {
      if (i < line1Full.length) {
        setDisplayedText(prev => ({ ...prev, line1: line1Full.slice(0, i + 1) }));
        i++;
        timeoutId = setTimeout(typeLine1, 50);
      } else {
        setActiveLine(2);
        timeoutId = setTimeout(typeLine2, 500); // Pause before next line
      }
    };

    const typeLine2 = () => {
      if (j < line2Full.length) {
        setDisplayedText(prev => ({ ...prev, line2: line2Full.slice(0, j + 1) }));
        j++;
        timeoutId = setTimeout(typeLine2, 30);
      }
    };

    timeoutId = setTimeout(typeLine1, 100);

    return () => clearTimeout(timeoutId);
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-3xl flex items-center justify-center mb-10 border border-white/10 shadow-2xl relative group p-3 md:p-4">
          <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <img 
            src="/rolepilotai.svg" 
            alt="RolePilot AI" 
            className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700"
          />
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
          <span className="block mb-2">{displayedText.line1}<span className={`inline-block w-1 h-8 md:w-1.5 md:h-11 ml-2 bg-blue-500 transition-opacity ${activeLine === 1 ? 'animate-pulse opacity-100' : 'opacity-0'}`} /></span>
          <span className="block text-vibrant-gradient leading-none py-1">{displayedText.line2}<span className={`inline-block w-1 h-8 md:w-1.5 md:h-11 ml-2 bg-violet-500 transition-opacity ${activeLine === 2 ? 'animate-pulse opacity-100' : 'opacity-0'}`} /></span>
        </h1>
        
        <p className="text-gray-400 text-xs md:text-sm max-w-sm mx-auto font-medium leading-relaxed opacity-60 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000 fill-mode-both">
          Engage with elite personas refined for professional excellence and creative depth.
        </p>
      </div>
    </div>
  );
}

export default Hero;
