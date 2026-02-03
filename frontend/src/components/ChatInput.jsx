import React, { useState } from 'react';
import { Paperclip, Globe, Image as ImageIcon, ArrowUp, Stethoscope, Heart, Sparkles, Users, Code } from 'lucide-react';

const ROLES = [
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
  { id: 'girlfriend', label: 'Girlfriend', icon: Heart, color: 'text-pink-400', bgColor: 'bg-pink-400/10' },
  { id: 'astrologer', label: 'Astrologer', icon: Sparkles, color: 'text-purple-400', bgColor: 'bg-purple-400/10' },
  { id: 'friend', label: 'Friend', icon: Users, color: 'text-green-400', bgColor: 'bg-green-400/10' },
  { id: 'programmer', label: 'Programmer', icon: Code, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' }
];

const ChatInput = ({ onSendMessage, chatStarted }) => {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    if (onSendMessage) {
      onSendMessage(message, selectedRole.id);
    }
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto px-4 absolute left-0 right-0 z-20 transition-all duration-700 ease-in-out ${
      chatStarted ? "bottom-6" : "top-[80%] -translate-y-1/2"
    }`}>
      <div className={`bg-[#1a1d26]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl transition-all duration-700 ${
        chatStarted ? "p-3" : "p-5"
      }`}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${selectedRole.label}...`}
          className={`w-full bg-transparent text-white placeholder-gray-500 outline-none px-2 transition-all duration-700 ${
            chatStarted ? "text-base pb-2" : "text-lg pb-12"
          }`}
        />
        
        <div className="flex justify-between items-center mt-2 px-2">
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-white transition-all duration-200 p-1.5 hover:bg-white/5 rounded-lg cursor-pointer active:scale-90">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="hover:text-white transition-all duration-200 p-1.5 hover:bg-white/5 rounded-lg cursor-pointer active:scale-90">
              <Globe className="w-5 h-5" />
            </button>
            <button className="hover:text-white transition-all duration-200 p-1.5 hover:bg-white/5 rounded-lg cursor-pointer active:scale-90">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-gray-400">
            {/* Role Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 border border-white/5 ${selectedRole.bgColor}`}
                title="Select Role"
              >
                <selectedRole.icon className={`w-5 h-5 ${selectedRole.color}`} />
              </button>

              {isRoleOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsRoleOpen(false)}
                  />
                  <div className="absolute bottom-full right-0 mb-4 w-72 bg-[#1a1d26]/95 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-4 z-20 animate-in fade-in slide-in-from-bottom-5 duration-200 origin-bottom-right">
                    <p className="text-xs font-semibold text-gray-400 mb-4 px-1 uppercase tracking-wider">Select Role</p>
                    <div className="grid grid-cols-3 gap-4">
                      {ROLES.map((role) => (
                        <button
                          key={role.id}
                          onClick={() => {
                            setSelectedRole(role);
                            setIsRoleOpen(false);
                          }}
                          className="flex flex-col items-center gap-2 group w-full"
                        >
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border border-white/5 group-hover:scale-110 shadow-lg ${
                             selectedRole.id === role.id ? 'bg-white/10 ring-2 ring-white/20' : 'bg-white/5 group-hover:bg-white/10'
                          }`}>
                            <role.icon className={`w-6 h-6 ${role.color}`} />
                          </div>
                          <span className={`text-xs font-medium text-center transition-colors duration-200 ${
                            selectedRole.id === role.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                          }`}>
                            {role.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={handleSend}
              className="bg-white text-black p-2 rounded-lg hover:bg-gray-200 transition-all duration-200 cursor-pointer active:scale-90 shadow-lg shadow-white/5"
            >
               <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-center text-gray-600 text-xs mt-6">
        Sense AI may contain errors. We recommend checking important information.
      </p>
    </div>
  );
};

export default ChatInput;
