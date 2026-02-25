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
    <div className="flex flex-col items-center justify-center min-h-[45vh] text-center px-4 mb-12">
      <div className="group relative transition-all duration-1000">
        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000 opacity-0 group-hover:opacity-100" />
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-12 cursor-pointer z-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <Sparkles className="w-10 h-10 text-black fill-black" />
        </div>
      </div>
      
      <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight flex flex-col gap-2">
        <span className="text-white drop-shadow-sm">
            {displayedText.line1}
            {activeLine === 1 && <span className="inline-block w-[3px] h-[1em] bg-blue-500 ml-1 animate-pulse" />}
        </span>
        <span className="text-gradient opacity-90">
          {displayedText.line2}
          {activeLine === 2 && <span className="inline-block w-[3px] h-[1em] bg-blue-500 ml-1 animate-pulse" />}
        </span>
      </h1>
      
      <div className="flex flex-col items-center gap-6 mt-4">
        <p className="text-gray-400 max-w-lg text-base md:text-lg leading-relaxed font-light transition-colors duration-700 ease-in-out hover:text-gray-200">
          Rolepilot AI brings your characters to life with <span className="text-white font-medium">precision</span> and <span className="text-white font-medium">personality</span>.
        </p>
        
        <div className="w-12 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>
    </div>
  );
}

export default Hero;
