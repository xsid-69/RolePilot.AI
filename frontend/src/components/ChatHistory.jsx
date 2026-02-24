import React, { useRef } from 'react';
import { MessageSquare, Plus } from 'lucide-react';

const ChatHistory = ({ chats, activeChatId, onSelectChat, onNewChat }) => {
    const scrollRef = useRef(null);

    return (
        <div className="w-full max-w-3xl mx-auto px-4 mt-4 mb-20"> 
            <div className="flex items-center justify-between mb-4">
                 <h3 className="text-gray-400 text-sm font-medium">Recent Chats</h3>
                 <button 
                    onClick={onNewChat}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium transition-colors border border-blue-500/20"
                >
                    <Plus size={14} />
                    New Chat
                </button>
            </div>
            
            <div 
                ref={scrollRef}
                className="flex flex-col gap-3 overflow-y-auto max-h-[300px] scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-2"
            >
                {chats.map((chat) => (
                    <button
                        key={chat._id}
                        onClick={() => onSelectChat(chat._id)}
                        className={`group flex items-center gap-3 px-4 py-3 border rounded-xl transition-all w-full text-left ${
                            activeChatId === chat._id 
                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200 hover:border-white/20'
                        }`}
                    >
                        <MessageSquare size={18} className={`shrink-0 ${activeChatId === chat._id ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate block">
                                {chat.title || "Untitled Chat"}
                            </span>
                            <span className="text-xs text-gray-500 truncate mt-0.5">
                                {new Date(chat.lastActivity).toLocaleDateString()}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChatHistory;
