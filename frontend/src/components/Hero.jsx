import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContextShared';
import { staggerContainer, staggerItem, smoothTransition } from '../lib/motion';

const Hero = React.memo(() => {
  const { user } = useUser();
  const firstName = user?.fullName?.firstName || "Anonymous";
  const line1Full = `Hi, ${firstName}`;
  const line2Full = "Can I help you with anything?";

  const [displayedText, setDisplayedText] = useState({ line1: line1Full, line2: line2Full });
  const [activeLine, setActiveLine] = useState(1);

  useEffect(() => {
    let i = 0;
    let j = 0;
    let timeoutId;

    setDisplayedText({ line1: "", line2: "" });
    setActiveLine(1);

    const typeLine1 = () => {
      if (i < line1Full.length) {
        setDisplayedText(prev => ({ ...prev, line1: line1Full.slice(0, i + 1) }));
        i++;
        timeoutId = setTimeout(typeLine1, 40);
      } else {
        setActiveLine(2);
        timeoutId = setTimeout(typeLine2, 400);
      }
    };

    const typeLine2 = () => {
      if (j < line2Full.length) {
        setDisplayedText(prev => ({ ...prev, line2: line2Full.slice(0, j + 1) }));
        j++;
        timeoutId = setTimeout(typeLine2, 25);
      }
    };

    typeLine1();
    return () => clearTimeout(timeoutId);
  }, [user, line1Full, line2Full]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center text-center max-w-2xl px-4"
    >
      <motion.div
        variants={staggerItem}
        className="relative mb-10"
      >
        {/* Pulsing glow ring */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full scale-150"
        />
        {/* Floating logo */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl relative p-3 md:p-4"
        >
          <img
            src="/rolepilotai.svg"
            alt="RolePilot AI"
            className="w-full h-full object-contain relative z-10"
            loading="eager"
            fetchpriority="high"
            width="80"
            height="80"
          />
        </motion.div>
      </motion.div>

      <motion.div variants={staggerItem} className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
          <span className="block mb-2">{displayedText.line1}<span className={`inline-block w-1 h-8 md:w-1.5 md:h-11 ml-2 bg-white transition-opacity ${activeLine === 1 ? 'animate-pulse opacity-100' : 'opacity-0'}`} /></span>
          <span className="block text-vibrant-gradient leading-none py-1">{displayedText.line2}<span className={`inline-block w-1 h-8 md:w-1.5 md:h-11 ml-2 bg-violet-500 transition-opacity ${activeLine === 2 ? 'animate-pulse opacity-100' : 'opacity-0'}`} /></span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ ...smoothTransition, delay: 1.5 }}
        className="text-gray-400 text-xs md:text-sm max-w-sm mx-auto font-medium leading-relaxed mt-4"
      >
        Talk to characters that keep their voice, backstory, and mood, persona after persona.
      </motion.p>
    </motion.div>
  );
});

export default Hero;
