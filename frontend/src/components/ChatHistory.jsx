import React, { useRef } from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';

const ChatHistory = ({ chats = [], activeChatId, onSelectChat, onDeleteChat }) => {
    const scrollRef = useRef(null);

    return (
        <div className="w-full mx-auto"> 
            <div 
                ref={scrollRef}
                className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar"
            >
                {chats.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl">
                        <MessageSquare className="w-8 h-8 text-gray-600 mb-3" />
                        <p className="text-gray-500 text-sm font-medium">No conversations yet</p>
                    </div>
                ) : chats.map((chat) => (
                    <div key={chat._id} className="relative group/container">
                        <button
                            onClick={() => onSelectChat(chat._id)}
                            className={`group flex items-center gap-4 px-5 py-4 border rounded-[20px] transition-all w-full text-left active:scale-[0.98] ${
                                activeChatId === chat._id 
                                    ? 'bg-blue-600/10 border-blue-500/50 text-blue-100 shadow-xl shadow-blue-500/5' 
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/8 hover:text-gray-200 hover:border-white/20'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                activeChatId === chat._id ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-500'
                            }`}>
                                <MessageSquare size={20} />
                            </div>
                            <div className="flex flex-col min-w-0 pr-10">
                                <span className="text-sm font-bold truncate block">
                                    {chat.title || "Untitled Chat"}
                                </span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-blue-500/50" />
                                    {new Date(chat.lastActivity).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </button>
                        
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if(onDeleteChat) onDeleteChat(chat._id);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-red-500/0 hover:bg-red-500/10 text-gray-600 hover:text-red-400 opacity-0 group-hover/container:opacity-100 transition-all active:scale-90"
                            title="Delete Chat"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatHistory;
