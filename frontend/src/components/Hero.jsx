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
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 mb-15">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
        <Sparkles className="w-8 h-8 text-black fill-black" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-medium text-white mb-4 tracking-tight">
        {displayedText.line1}
        {activeLine === 1 && <span className="animate-pulse">|</span>}
        <br />
        <span className="text-gray-400">
          {displayedText.line2}
          {activeLine === 2 && <span className="animate-pulse">|</span>}
        </span>
      </h1>
      
      <p className="text-gray-500 max-w-lg mt-4 text-sm md:text-base leading-relaxed">
        Ready to assist you with anything you need?
      </p>
    </div>
  );
};

export default Hero;
