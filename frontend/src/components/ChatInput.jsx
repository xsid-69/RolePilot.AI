import React, { useState, useRef } from 'react';
import { 
  Paperclip, Globe, Image as ImageIcon, ArrowUp, Sparkles, 
  Heart, Stethoscope, Moon, Coffee, Code, Target, ClipboardCheck, Smile,
  User
} from 'lucide-react';

const ROLE_ICONS = {
  "Caring Girlfriend": Heart,
  "Professional Doctor": Stethoscope,
  "Mystic Astrologer": Moon,
  "Chill Best Friend": Coffee,
  "Senior Software Engineer": Code,
  "Career Mentor": Target,
  "Technical Interviewer": ClipboardCheck,
  "Empathetic Therapist": Smile
};

const ChatInput = ({ onSendMessage, chatStarted, personas = [], selectedPersona, setSelectedPersona, error, user }) => {
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isAttaching, setIsAttaching] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsAttaching(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setMessage(prev => prev + (prev.trim() ? `\n\n` : '') + `[Attached File: ${file.name}]\n${text}\n`);
      setIsAttaching(false);
    };
    reader.onerror = () => {
      alert("Failed to read file. Please ensure it is a text-based file.");
      setIsAttaching(false);
    };
    reader.readAsText(file);
    e.target.value = null; // reset for same file re-selection
  };

  const systemPersonas = personas?.filter(p => p.isSystem) || [];
  const customPersonas = personas?.filter(p => !p.isSystem) || [];

  const renderPersona = (persona) => {
    const IconComponent = ROLE_ICONS[persona.name] || (persona.isSystem ? Sparkles : User);
    return (
      <button
        key={persona._id}
        onClick={() => {
          setSelectedPersona(persona);
          setIsRoleOpen(false);
        }}
        className={`flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-xl md:rounded-2xl group transition-all duration-200 text-left ${
          selectedPersona?._id === persona._id ? 'bg-violet-500/10 border border-violet-500/20' : 'hover:bg-white/5 border border-transparent'
        }`}
      >
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 ${
          selectedPersona?._id === persona._id ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-white/5 group-hover:bg-white/10 text-gray-400 group-hover:text-violet-400'
        }`}>
          {persona.avatar ? (
            <img src={persona.avatar} alt={persona.name} className="w-full h-full object-cover rounded-lg md:rounded-xl" />
          ) : (
            <IconComponent size={14} className="md:w-[18px] md:h-[18px]" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className={`text-[11px] md:text-sm font-semibold truncate transition-colors duration-200 ${
            selectedPersona?._id === persona._id ? 'text-white' : 'text-gray-300 group-hover:text-white'
          }`}>
            {persona.name}
          </span>
          <span className="text-[9px] md:text-[10px] text-gray-500 font-medium uppercase tracking-tighter truncate">
            {persona.role}
          </span>
        </div>
      </button>
    );
  };

  const handleSend = () => {
    if (!message.trim()) return;
    if (onSendMessage) {
      onSendMessage(message); // Role ID is now handled by selectedPersona in Layout
    }
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`w-full max-w-3xl  mx-auto px-2 md:px-4 z-20 transition-all duration-700 ease-in-out ${
      chatStarted ? "absolute bottom-0.5 left-0 right-0 transform-none scale-100" : "absolute left-0 right-0 top-[80%] md:top-[75%] -translate-y-1/2 scale-100 md:scale-105"
    }`}>
      <div className={`glass-panel mb-3 md:mb-5 transition-all duration-700 rounded-[2.5rem]! ${
        chatStarted ? "p-1.5 md:p-2" : "p-3 md:p-4"
      }`}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!user}
          placeholder={
            !user ? "Please login to continue chat..." : 
            !selectedPersona ? "Select a persona to start chatting..." :
            isAttaching ? "Reading file..." :
            `Message ${selectedPersona?.name}...`
          }
          rows={Math.max(1, Math.min(5, message.split('\n').length))}
          className={`w-full bg-transparent text-white placeholder-gray-500 outline-none px-4 md:px-6 transition-all duration-700 resize-none overflow-y-auto custom-scrollbar ${
            chatStarted ? "text-sm md:text-base pb-0 md:pb-1 pt-1 md:pt-2" : "text-base md:text-lg pb-4 md:pb-6 pt-2 md:pt-3"
          } ${!user ? 'cursor-not-allowed italic' : ''}`}
        />
        
        <div className="flex justify-between items-center mt-1 md:mt-2 px-2 md:px-4">
          <div className="flex items-center gap-2 md:gap-4 text-gray-400">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`hover:text-white transition-all duration-200 p-1 md:p-1.5 hover:bg-white/5 rounded-lg cursor-pointer active:scale-90 ${isAttaching ? 'animate-pulse text-violet-400' : ''}`}
              title="Attach File"
            >
              <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange}
              accept=".txt,.js,.jsx,.ts,.tsx,.json,.md,.csv,.html,.css" 
            />
            <button className="hover:text-white transition-all duration-200 p-1 md:p-1.5 hover:bg-white/5 rounded-lg cursor-pointer active:scale-90">
              <Globe className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="hidden xs:block hover:text-white transition-all duration-200 p-1 md:p-1.5 hover:bg-white/5 rounded-lg cursor-pointer active:scale-90">
              <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 text-gray-400">
            {/* Role Selector */}
            <div className="relative">
              <button 
                id='roleselector'
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 border border-white/10 glass-panel hover:bg-white/5`}
                title="Select Role"
              >
                <Sparkles className={`w-4 h-4 md:w-5 md:h-5 text-violet-400`} />
              </button>

              {isRoleOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsRoleOpen(false)}
                  />
                  <div className="absolute bottom-full right-0 mb-3 md:mb-4 w-64 md:w-72 glass-panel rounded-3xl! overflow-hidden p-3 md:p-4 z-40 animate-in fade-in slide-in-from-bottom-5 duration-300 origin-bottom-right">
                    <div className="max-h-64 md:max-h-80 overflow-y-auto pr-1 space-y-3 md:space-y-4">
                      {error ? (
                        <div className="py-4 md:py-6 text-center px-2 md:px-4">
                          <p className="text-red-400 text-xs md:text-sm font-medium">Error loading roles</p>
                          <p className="text-[10px] text-gray-500 mt-1">{error}</p>
                        </div>
                      ) : (!personas || personas.length === 0) ? (
                        <div className="py-4 md:py-6 text-center">
                          <p className="text-gray-500 text-xs md:text-sm">No roles found</p>
                        </div>
                      ) : (
                        <>
                          {systemPersonas.length > 0 && (
                            <div>
                              <p className="text-[9px] md:text-[10px] font-bold text-gray-500 mb-1.5 md:mb-2 px-1 uppercase tracking-widest">Default Roles</p>
                              <div className="grid grid-cols-1 gap-1">
                                {systemPersonas.map(renderPersona)}
                              </div>
                            </div>
                          )}
                          
                          {(customPersonas.length > 0 || (systemPersonas.length === 0 && personas.length > 0)) && (
                            <div className="mt-3 md:mt-4">
                              <p className="text-[9px] md:text-[10px] font-bold text-gray-500 mb-1.5 md:mb-2 px-1 uppercase tracking-widest">
                                {systemPersonas.length > 0 ? "My Personas" : "Available Personas"}
                              </p>
                              <div className="grid grid-cols-1 gap-1">
                                {(customPersonas.length > 0 ? customPersonas : personas).map(renderPersona)}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={handleSend}
              disabled={!user || !message.trim()}
              className={`${
                !user || !message.trim() ? "bg-white/5 text-gray-600 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200 cursor-pointer active:scale-95 shadow-lg shadow-white/5"
              } p-1.5 md:p-2 rounded-lg transition-all duration-200`}
            >
               <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
