import React, { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import ChatInput from '../components/ChatInput'
import { io } from 'socket.io-client'
import axios from 'axios'

const Layout = () => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
    });

    newSocket.on('ai-error', (error) => {
      console.error("AI Error", error);
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error." }]);
    });

    return () => newSocket.close();
  }, []);

  const handleSendMessage = async (content, role) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    try {
      let currentChatId = chatId;
      
      if (!currentChatId) {
         try {
            const res = await axios.post("http://localhost:3000/api/chat", { title: content.substring(0, 20) }, { withCredentials: true });
            currentChatId = res.data.chat._id;
            setChatId(currentChatId);
         } catch (createError) {
             console.error("Failed to create chat:", createError);
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
    <div className="min-h-screen bg-[#0f1115] text-white font-sans selection:bg-white/20 relative overflow-hidden flex flex-col">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#1f232e] via-[#0f1115] to-transparent opacity-70 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full min-h-screen">
        <Header onNewChat={() => {
          setMessages([]);
          setChatId(null);
        }} />
        
        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto relative">
          {messages.length === 0 ? (
            <Hero />
          ) : (
            <div className="md:w-[70%] w-[80%] flex-1 overflow-y-auto p-4 pb-40 scrollbar-hide flex flex-col gap-6 mask-image-b">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
        
        <ChatInput onSendMessage={handleSendMessage} chatStarted={messages.length > 0} />
      </div>
    </div>
  )
}

export default Layout
