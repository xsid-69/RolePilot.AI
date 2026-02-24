import React, { useState, useEffect, useRef, useCallback } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import ChatInput from '../components/ChatInput'
import { io } from 'socket.io-client'
import axios from 'axios'
import ChatHistory from '../components/ChatHistory';
import PersonaCard from '../components/PersonaCard';
import PersonaModal from '../components/PersonaModal';
import { toast } from 'react-toastify';
import { Sparkles } from 'lucide-react';

import { useUser } from '../context/UserContextShared';

const Layout = () => {
  const { user } = useUser();
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [chats, setChats] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [personaError, setPersonaError] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChats = useCallback(async () => {
      try {
          const res = await axios.get("http://localhost:3000/api/chat", { withCredentials: true });
          if(res.data.success){
              setChats(res.data.chats);
          }
      } catch (error) {
          console.error("Failed to fetch chats", error);
      }
  }, []);

  const fetchPersonas = useCallback(async () => {
      try {
          console.log("Fetching personas from API...");
          const res = await axios.get("http://localhost:3000/api/personas", { withCredentials: true });
          console.log("API Response:", res.data);
          if (res.data.success) {
              console.log(`Fetched ${res.data.personas.length} personas`);
              setPersonas(res.data.personas);
              setPersonaError(null);
          } else {
              setPersonaError(res.data.message || "Failed to fetch personas");
              console.error("API success: false", res.data.message);
          }
      } catch (error) {
          const msg = error.response?.data?.message || error.message;
          setPersonaError(msg);
          console.error("Failed to fetch personas", msg);
      }
  }, []);

  useEffect(() => {
    fetchChats();
    fetchPersonas();
    
    // Global hook for Header to trigger persona management
    window.onManagePersonas = () => {
        setEditingPersona(null);
        setIsPersonaModalOpen(true);
    };
    
    return () => {
        delete window.onManagePersonas;
    };
  }, [fetchChats, fetchPersonas]);



  const handleSavePersona = async (formData) => {
      try {
          let res;
          if (editingPersona) {
              res = await axios.put(`http://localhost:3000/api/personas/${editingPersona._id}`, formData, { withCredentials: true });
          } else {
              res = await axios.post("http://localhost:3000/api/personas", formData, { withCredentials: true });
          }

          if (res.data.success) {
              toast.success(editingPersona ? "Persona updated!" : "Persona created!");
              fetchPersonas();
              setIsPersonaModalOpen(false);
              setEditingPersona(null);
          }
      } catch (error) {
          toast.error(error.response?.data?.message || "Something went wrong.");
      }
  };

  const handleDeletePersona = async (id) => {
      if (!window.confirm("Are you sure you want to delete this persona?")) return;
      try {
          const res = await axios.delete(`http://localhost:3000/api/personas/${id}`, { withCredentials: true });
          if (res.data.success) {
              toast.success("Persona deleted.");
              fetchPersonas();
              if (selectedPersona?._id === id) {
                  setSelectedPersona(personas.find(p => p._id !== id) || null);
              }
          }
      } catch (err) {
          console.error("Delete Error", err);
          toast.error("Failed to delete persona.");
      }
  };

  const loadChat = async (id) => {
      setChatId(id);
      setIsLoading(true);
      setMessages([]); // Clear previous messages immediately
      try {
          const res = await axios.get(`http://localhost:3000/api/chat/${id}/messages`, { withCredentials: true });
          if (res.data.success) {
              setMessages(res.data.messages.map(msg => ({ role: msg.role === 'model' ? 'ai' : msg.role, content: msg.content })));
              
              // Find linked persona for this chat
              const chat = chats.find(c => c._id === id);
              if (chat && chat.persona) {
                  const personaObj = typeof chat.persona === 'object' ? chat.persona : personas.find(p => p._id === chat.persona);
                  if (personaObj) setSelectedPersona(personaObj);
              }
          }
      } catch (error) {
          console.error("Failed to load chat messages", error);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle opening message when persona is selected for a new chat
  useEffect(() => {
    if (!chatId && selectedPersona?.openingMessage && messages.length === 0) {
        setMessages([{ role: 'ai', content: selectedPersona.openingMessage }]);
    }
  }, [selectedPersona, chatId, messages.length]);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
    });
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Connected to socket');
    });

    newSocket.on('ai-response', (data) => {
      setMessages(prev => [...prev, { role: 'ai', content: data.content }]);
      setIsLoading(false);
      fetchChats(); // Refresh chat list to update last activity order
    });

    newSocket.on('ai-error', (error) => {
      console.error("AI Error", error);
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error." }]);
    });

    return () => newSocket.close();
  }, [fetchChats]);

  const handleSendMessage = async (content, role) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    try {
      let currentChatId = chatId;
      
      if (!currentChatId) {
         if (!selectedPersona) {
             toast.error("Please select a persona first.");
             setIsLoading(false);
             return;
         }

         try {
            const res = await axios.post("http://localhost:3000/api/chat", { 
                title: content.substring(0, 20),
                personaId: selectedPersona._id
            }, { withCredentials: true });
            currentChatId = res.data.chat._id;
            setChatId(currentChatId);
            fetchChats(); // Refresh list to show new chat
         } catch (createError) {
             console.error("Failed to create chat:", createError);
             toast.error(createError.response?.data?.message || "Failed to start chat.");
             setIsLoading(false);
             return; 
         }
      }

      if (socketRef.current) {
          socketRef.current.emit('ai-message', {
              chat: currentChatId,
              content: content,
              role
          });
      }
    } catch (err) {
        console.error("Error sending message", err);
        setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#0f1115] text-white font-sans selection:bg-white/20 overflow-y-auto scroll-smooth snap-y snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden">
      {/* Ambient Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#1f232e] via-[#0f1115] to-transparent opacity-70 pointer-events-none" />
      
      <PersonaModal 
          key={editingPersona?._id || (isPersonaModalOpen ? 'new' : 'closed')}
          isOpen={isPersonaModalOpen}
          onClose={() => setIsPersonaModalOpen(false)}
          onSave={handleSavePersona}
          persona={editingPersona}
      />

      {/* SECTION 1: Chat Interface */}
      <div className="relative z-10 flex flex-col h-screen snap-start">
        <Header onNewChat={() => {
          setMessages([]);
          setChatId(null);
          setSelectedPersona(null);
        }} />
        
        <main className="flex-1 flex flex-col items-center w-full max-w-5xl mx-auto relative overflow-hidden pb-24 pt-20 min-h-0">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-start w-full px-4 overflow-y-auto pt-10 scrollbar-hide">
                <Hero />
                
                <div className="w-full max-w-4xl mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-gray-400 font-medium">Choose a Persona</h3>
                        {user ? (
                            <button 
                                onClick={() => { setEditingPersona(null); setIsPersonaModalOpen(true); }}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1.5 transition-colors"
                            >
                                + Create Custom
                            </button>
                        ) : (
                            <div className="text-gray-500 text-xs italic">Sign in to create custom roles</div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                        {personas.map(persona => (
                            <PersonaCard 
                                key={persona._id}
                                persona={persona}
                                isSelected={selectedPersona?._id === persona._id}
                                onSelect={setSelectedPersona}
                                isOwner={persona.createdBy === user?._id} 
                                onEdit={(p) => { setEditingPersona(p); setIsPersonaModalOpen(true); }}
                                onDelete={handleDeletePersona}
                            />
                        ))}
                    </div>
                </div>

                {chats.length > 0 && (
                     <div className="animate-bounce mt-10 text-gray-500 text-sm">Scroll for history ↓</div> 
                )}
            </div>
          ) : (
            <div className="md:w-[70%] w-[80%] flex-1 overflow-y-auto p-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-6 mask-image-b">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/20">
                            <Sparkles size={14} className="text-blue-400" />
                        </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === 'user' 
                        ? 'bg-blue-500/10 text-blue-100 border border-blue-500/20 rounded-tr-sm' 
                        : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-sm'
                    }`}>
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                 </div>
               ))}
               {isLoading && (
                 <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/20">
                        <Sparkles size={14} className="text-blue-400" />
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-sm border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>
          )}
        </main>
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          chatStarted={messages.length > 0} 
          personas={personas}
          selectedPersona={selectedPersona}
          setSelectedPersona={setSelectedPersona}
          error={personaError}
          user={user}
        />
      </div>

      {/* SECTION 2: Chat History (Visible on scroll for logged-in users only) */}
      {user && (
          <div className="min-h-[50vh] bg-[#0f1115] relative z-10 flex flex-col items-center pt-10 pb-20 snap-start border-t border-white/5">
            <h3 className="text-gray-400 font-medium mb-6">Chat History</h3>
            <div className="w-full max-w-3xl px-4">
                <ChatHistory 
                    chats={chats} 
                    activeChatId={chatId} 
                    onSelectChat={(id) => {
                        loadChat(id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    onNewChat={() => {
                        setChatId(null);
                        setMessages([]);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                />
            </div>
          </div>
      )}
    </div>
  )
}

export default Layout
