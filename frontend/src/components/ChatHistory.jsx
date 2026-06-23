import React, { useRef } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, springTransition } from '../lib/motion';

const ChatHistory = ({ chats = [], activeChatId, onSelectChat, onDeleteChat }) => {
    const scrollRef = useRef(null);

    return (
        <div className="w-full mx-auto">
            <motion.div
                ref={scrollRef}
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] md:max-h-[65vh] pr-2 custom-scrollbar"
            >
                {chats.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-12 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl"
                    >
                        <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <MessageSquare className="w-8 h-8 text-gray-600 mb-3" />
                        </motion.div>
                        <p className="text-gray-500 text-sm font-medium">No conversations yet</p>
                    </motion.div>
                ) : chats.map((chat) => (
                    <motion.div
                        key={chat._id}
                        variants={staggerItem}
                        className="relative group/container"
                    >
                        <motion.button
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            transition={springTransition}
                            onClick={() => onSelectChat(chat._id)}
                            className={`group flex items-center gap-4 px-5 py-4 border rounded-2xl transition-colors w-full text-left ${
                                activeChatId === chat._id
                                    ? 'bg-violet-600/10 border-violet-500/50 text-violet-100 shadow-xl shadow-violet-500/5'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/8 hover:text-gray-200 hover:border-white/20'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors font-bold ${
                                activeChatId === chat._id ? 'bg-violet-500 text-white' : 'bg-white/10 text-violet-400'
                            }`}>
                                {chat.persona?.name ? chat.persona.name.charAt(0).toUpperCase() : <MessageSquare size={18} />}
                            </div>
                            <div className="flex flex-col min-w-0 pr-10">
                                <span className="text-sm font-bold truncate block">
                                    {chat.title || "Untitled Chat"}
                                </span>
                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-2">
                                    <span className="text-violet-500/80">{chat.persona?.name || "Persona"}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                                    {new Date(chat.lastActivity).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if(onDeleteChat) onDeleteChat(chat._id);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-red-500/0 hover:bg-red-500/10 text-gray-600 hover:text-red-400 opacity-0 group-hover/container:opacity-100 transition-opacity"
                            title="Delete Chat"
                        >
                            <Trash2 size={16} />
                        </motion.button>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default ChatHistory;
