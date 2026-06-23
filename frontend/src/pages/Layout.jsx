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
import { Sparkles, History, ChevronDown } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, slideInFromBottom, staggerContainer, staggerItem, springTransition, smoothTransition } from '../lib/motion';

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
  const [pullProgress, setPullProgress] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const pullIntervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChats = useCallback(async () => {
      try {
          const getAuthHeaders = () => ({
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              withCredentials: true
          });

          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat`, getAuthHeaders());
          if(res.data.success){
              setChats(res.data.chats);
          }
      } catch (error) {
          console.error("Failed to fetch chats", error);
      }
  }, []);

  const fetchPersonas = useCallback(async () => {
      try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/personas`, {
              withCredentials: true,
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.data.success) {
              setPersonas(res.data.personas);
              setPersonaError(null);
          } else {
              setPersonaError(res.data.message || "Failed to fetch personas");
          }
      } catch (error) {
          const msg = error.response?.data?.message || error.message;
          setPersonaError(msg);
      }
  }, []);

  useEffect(() => {
    if (!user) {
        setChatId(null);
        setMessages([]);
        setChats([]);
        setIsHistoryVisible(false);
        setPullProgress(0);
        setIsPulling(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
        fetchChats();
        fetchPersonas();
    }

    window.onManagePersonas = () => {
        setEditingPersona(null);
        setIsPersonaModalOpen(true);
    };

    return () => {
        delete window.onManagePersonas;
    };
  }, [fetchChats, fetchPersonas, user]);

  const handleSavePersona = useCallback(async (formData) => {
      try {
          const method = editingPersona ? 'put' : 'post';
          const endpoint = editingPersona
                ? `${import.meta.env.VITE_API_URL}/api/personas/${editingPersona._id}`
                : `${import.meta.env.VITE_API_URL}/api/personas`;

          const res = await axios[method](endpoint, formData, {
              withCredentials: true,
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });

          if (res.data.success) {
              toast.success(editingPersona ? "Persona updated!" : "Persona created!");
              fetchPersonas();
              setIsPersonaModalOpen(false);
              setEditingPersona(null);
          }
      } catch (error) {
          toast.error(error.response?.data?.message || "Operation failed.");
      }
  }, [editingPersona, fetchPersonas]);

  const handleDeletePersona = useCallback(async (id) => {
      if (!window.confirm("Delete this persona forever?")) return;
      try {
          const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/personas/${id}`, {
              withCredentials: true,
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.data.success) {
              toast.success("Persona deleted.");
              fetchPersonas();
              if (selectedPersona?._id === id) {
                  setSelectedPersona(null);
              }
          }
      } catch (err) {
          console.error("Delete Error", err);
          toast.error("Failed to delete persona.");
      }
  }, [fetchPersonas, selectedPersona?._id]);

  const loadChat = async (id) => {
      setChatId(id);
      setIsLoading(true);
      setMessages([]);
      try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat/${id}/messages`, {
              withCredentials: true,
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.data.success) {
              setMessages(res.data.messages.map(msg => ({ role: msg.role === 'model' ? 'ai' : msg.role, content: msg.content })));

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

  const handleDeleteChat = async (id) => {
      if (!window.confirm("Are you sure you want to delete this conversation and its entire history?")) return;
      try {
          const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/chat/${id}`, {
              withCredentials: true,
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.data.success) {
              toast.success("Conversation deleted.");
              fetchChats();
              if (chatId === id) {
                  setChatId(null);
                  setMessages([]);
              }
          }
      } catch (err) {
          console.error("Delete Chat Error", err);
          toast.error("Failed to delete conversation.");
      }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!chatId && selectedPersona?.openingMessage && messages.length === 0) {
        setMessages([{ role: 'ai', content: selectedPersona.openingMessage }]);
    }
  }, [selectedPersona, chatId, messages.length]);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      auth: {
        token: localStorage.getItem('token')
      }
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {});

    newSocket.on('ai-response', (data) => {
      setMessages(prev => [...prev, { role: 'ai', content: data.content }]);
      setIsLoading(false);
      fetchChats();
    });

    newSocket.on('ai-error', (error) => {
      console.error("AI Error", error);
      setIsLoading(false);
      const errorContent = error?.error || "Sorry, I encountered an error. Please try again.";
      setMessages(prev => [...prev, { role: 'ai', content: errorContent }]);
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
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, {
                title: content.substring(0, 20),
                personaId: selectedPersona._id
            }, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            currentChatId = res.data.chat._id;
            setChatId(currentChatId);
            fetchChats();
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
      console.error("Socket emit error", err);
      setIsLoading(false);
    }
  };

  const handleChatScroll = (e) => {
    const container = e.currentTarget;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    setShowScrollButton(!isAtBottom);
  };

  const handleWheel = (e) => {
    if (!user) return;
    const container = e.currentTarget;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 5;

    if (isAtBottom && e.deltaY > 0) {
      setIsPulling(true);
    } else {
      setIsPulling(false);
      setPullProgress(0);
    }
  };

  const handleTouchStart = (e) => {
    if (!user) return;
    const container = e.currentTarget;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 5;
    if (isAtBottom) {
      const touch = e.touches[0];
      container._startY = touch.clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (!user) return;
    const container = e.currentTarget;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 5;

    if (isAtBottom && container._startY !== undefined) {
      const touch = e.touches[0];
      const deltaY = touch.clientY - container._startY;

      if (deltaY < -50) {
        setIsPulling(true);
      } else if (deltaY > 10) {
        setIsPulling(false);
        setPullProgress(0);
      }
    }
  };

  const handleTouchEnd = (e) => {
    const container = e.currentTarget;
    delete container._startY;
    setIsPulling(false);
    setPullProgress(0);
  };

  useEffect(() => {
    if (isPulling && !isHistoryVisible) {
      pullIntervalRef.current = setInterval(() => {
        setPullProgress((prev) => {
          if (prev >= 100) {
            clearInterval(pullIntervalRef.current);
            setIsHistoryVisible(true);
            setIsPulling(false);
            return 100;
          }
          return prev + 1;
        });
      }, 25);
    } else {
      clearInterval(pullIntervalRef.current);
      setPullProgress(0);
    }
    return () => clearInterval(pullIntervalRef.current);
  }, [isPulling, isHistoryVisible]);

  const [isInputVisible, setIsInputVisible] = useState(true);

  useEffect(() => {
    const handleScroll = (e) => {
      if (messages.length > 0) {
        setIsInputVisible(true);
        return;
      }

      const target = e.target;
      if (!target || typeof target.scrollTop === 'undefined') return;

      if (target.scrollTop > 20) {
        setIsInputVisible(false);
      } else {
        setIsInputVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [messages.length]);

  return (
    <div className="h-screen bg-[#0c0c0e] text-white font-sans selection:bg-violet-500/30 overflow-y-auto scroll-smooth">
      {/* Premium Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0c0c0e] mesh-gradient-bg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(255,255,255,0.06)_0%,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)]" />

        {selectedPersona?.background && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={selectedPersona.background}
              className="w-full h-full object-cover opacity-[0.05] grayscale contrast-125 mix-blend-overlay"
              alt=""
            />
            <div className="absolute inset-0 bg-linear-to-b from-[#0c0c0e] via-transparent to-[#0c0c0e]" />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isPersonaModalOpen && (
          <PersonaModal
              key={editingPersona?._id || 'new'}
              isOpen={isPersonaModalOpen}
              onClose={() => setIsPersonaModalOpen(false)}
              onSave={handleSavePersona}
              persona={editingPersona}
          />
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        <Header
          onNewChat={() => {
            setMessages([]);
            setChatId(null);
            setSelectedPersona(null);
          }}
          onShowHistory={() => setIsHistoryVisible(true)}
        />

        <main className="flex-1 flex flex-col w-full max-w-6xl mx-auto relative overflow-hidden pb-10 pt-20 md:pt-28">
          {messages.length === 0 ? (
            <div
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="flex-1 flex flex-col items-center w-full px-6 overflow-y-auto custom-scrollbar pt-8"
            >
                <Hero />

                <div className="w-full mt-12 mb-20">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={smoothTransition}
                      className="flex items-center justify-between mb-8"
                    >
                        <div className="flex items-center gap-3">
                            <motion.div
                              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(217,164,63,0.5)]"
                            />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Personalities</h3>
                        </div>
                        {user ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setEditingPersona(null); setIsPersonaModalOpen(true); }}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-violet-400 hover:bg-white/10 hover:text-violet-300 transition-all"
                            >
                                + Create Custom
                            </motion.button>
                        ) : (
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">Sign in to customize</div>
                        )}
                    </motion.div>

                    <motion.div
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                      className="bento-grid"
                    >
                        {personas.map((persona, idx) => (
                            <motion.div key={persona._id} variants={staggerItem}>
                                <PersonaCard
                                    persona={persona}
                                    isSelected={selectedPersona?._id === persona._id}
                                    onSelect={setSelectedPersona}
                                    isOwner={persona.createdBy === user?._id}
                                    onEdit={(p) => { setEditingPersona(p); setIsPersonaModalOpen(true); }}
                                    onDelete={handleDeletePersona}
                                    priority={idx < 2}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {user && chats.length > 0 && (
                     <motion.div
                       animate={{ y: [0, -3, 0] }}
                       transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                       className="mt-auto pb-12 flex flex-col items-center gap-4 opacity-40"
                     >
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Swipe up and hold to see previous chats</span>
                        <div className="w-px h-12 bg-linear-to-b from-gray-500 to-transparent" />
                     </motion.div>
                )}
            </div>
          ) : (
            <div
              onWheel={handleWheel}
              onScroll={handleChatScroll}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full max-w-4xl mx-auto flex-1 overflow-y-auto px-6 py-5 custom-scrollbar flex flex-col gap-8 relative"
            >
               {messages.map((msg, idx) => (
                 <motion.div
                   key={idx}
                   initial={{ opacity: 0, y: 12 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ ...springTransition, delay: msg.role === 'ai' ? 0.1 : 0 }}
                   className={`flex gap-5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                 >
                    {msg.role === 'ai' && (
                        <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0 border border-violet-500/20 shadow-lg shadow-violet-500/5 mt-1 overflow-hidden">
                            {selectedPersona?.avatar ? (
                                <img src={selectedPersona.avatar} className="w-full h-full object-cover" alt={`${selectedPersona.name} avatar`} />
                            ) : (
                                <Sparkles size={18} className="text-violet-400" />
                            )}
                        </div>
                    )}
                    <div className={`${
                      msg.role === 'user'
                        ? 'max-w-[80%] rounded-[24px] px-6 py-4 bg-white/10 text-white border border-white/20 rounded-tr-lg backdrop-blur-2xl shadow-[0_20px_40px_rgba(255,255,255,0.05)] hover:bg-white/15 transition-all duration-500'
                        : 'w-full max-w-[85%] rounded-3xl px-8 py-6 glass-panel text-gray-200 rounded-tl-lg'
                    }`}>
                        {msg.role === 'user' ? (
                            <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
                        ) : (
                            <MarkdownRenderer content={msg.content} />
                        )}
                    </div>
                 </motion.div>
               ))}
               {isLoading && (
                 <motion.div
                   initial={{ opacity: 0, y: 12 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex gap-5 justify-start"
                 >
                    <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0 border border-violet-500/20">
                        <Sparkles size={18} className="text-violet-400" />
                    </div>
                    <div className="bg-white/3 px-6 py-5 rounded-[24px] rounded-tl-lg border border-white/5 flex items-center gap-3 backdrop-blur-md loading-shimmer">
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-1.5 h-1.5 bg-violet-500 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                          className="w-1.5 h-1.5 bg-violet-500 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                          className="w-1.5 h-1.5 bg-violet-500 rounded-full"
                        />
                    </div>
                 </motion.div>
               )}
                {user && chats.length > 0 && (
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="flex flex-col items-center gap-3 py-10 opacity-30 hover:opacity-50 transition-opacity"
                    >
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Swipe up and hold to see Previous Chats</span>
                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                    </motion.div>
                )}
                <div ref={messagesEndRef} className="h-8" />

                {/* Scroll to Bottom Button */}
                <AnimatePresence>
                  {showScrollButton && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={scrollToBottom}
                      className="fixed bottom-28 right-8 md:right-12 p-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full shadow-2xl z-30"
                      title="Scroll to bottom"
                      aria-label="Scroll to bottom of chat"
                    >
                      <ChevronDown size={20} />
                    </motion.button>
                  )}
                </AnimatePresence>
            </div>
          )}

          {/* Circular Progress for History */}
          <AnimatePresence>
            {pullProgress > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed bottom-32 left-1/2 -translate-x-1/2 z-100 flex flex-col items-center gap-3"
              >
                  <motion.div
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="relative w-14 h-14"
                  >
                      <svg className="w-full h-full -rotate-90">
                          <circle
                              cx="28" cy="28" r="24"
                              fill="transparent"
                              stroke="currentColor"
                              strokeWidth="4"
                              className="text-white/5"
                          />
                          <circle
                              cx="28" cy="28" r="24"
                              fill="transparent"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeDasharray={150.8}
                              strokeDashoffset={150.8 - (150.8 * pullProgress) / 100}
                              strokeLinecap="round"
                              className="text-violet-500 transition-all duration-75 ease-out"
                          />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <History size={16} className="text-violet-400 animate-pulse" />
                      </div>
                  </motion.div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 bg-[#0a0a0c] px-3 py-1 rounded-full border border-violet-500/20 shadow-2xl">
                      Hold to View Chats
                  </span>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <div className={`fixed ${messages.length > 0 ? 'bottom-4' : 'bottom-12 md:bottom-20'} left-0 right-0 z-20 pointer-events-none transition-all duration-500 ease-in-out ${isInputVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="max-w-4xl mx-auto pointer-events-auto px-4 md:px-6">
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
        </div>
      </div>

       {/* Chat History Popup Overlay */}
       <AnimatePresence>
         {isHistoryVisible && user && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 20 }}
             transition={smoothTransition}
             className="fixed inset-0 z-60 bg-[#0c0c0e]/80 backdrop-blur-2xl flex flex-col items-center"
           >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsHistoryVisible(false)}
              className="absolute top-8 right-8 p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Close conversation history"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest">Close Archive</span>
              </div>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothTransition, delay: 0.1 }}
              className="flex flex-col items-center mt-12 md:mt-16 mb-6 px-6 text-center"
            >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 shadow-xl">
                    <History className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Conversation Archive</h3>
                <p className="text-gray-500 text-xs max-w-xs leading-relaxed font-medium">Continue your professional interactions from previous sessions.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothTransition, delay: 0.2 }}
              className="w-full max-w-5xl px-8 overflow-y-auto custom-scrollbar pb-20"
            >
                <div className="premium-card rounded-4xl p-8">
                    <ChatHistory
                        chats={chats}
                        activeChatId={chatId}
                        onSelectChat={(id) => {
                            loadChat(id);
                            setIsHistoryVisible(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onDeleteChat={handleDeleteChat}
                        onNewChat={() => {
                            setChatId(null);
                            setMessages([]);
                            setIsHistoryVisible(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                </div>
            </motion.div>
          </motion.div>
         )}
       </AnimatePresence>
    </div>
  )
}

export default Layout
