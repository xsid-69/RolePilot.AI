import React from 'react';
import { User, Settings, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { springTransition } from '../lib/motion';

const PersonaCard = React.memo(({ persona, onSelect, onEdit, onDelete, isSelected, isOwner, priority = false }) => {
    const optimizedBg = persona.background ? `${persona.background}` : null;
    const optimizedAvatar = persona.avatar ? `${persona.avatar}` : null;

    return (
        <motion.div
            onClick={() => onSelect(persona)}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={springTransition}
            className={`premium-card group h-full rounded-4xl cursor-pointer select-none min-h-90 flex flex-col ${
                isSelected
                ? 'ring-2 ring-violet-500/50 shadow-[0_20px_40px_rgba(217,164,63,0.15)] scale-[1.02] bg-surface-high'
                : ''
            }`}
        >
            {/* Background Image Container */}
            <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0 z-0"
            >
                {optimizedBg ? (
                    <img
                        src={optimizedBg}
                        loading={priority ? "eager" : "lazy"}
                        fetchpriority={priority ? "high" : "auto"}
                        width="400"
                        height="360"
                        className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                        alt=""
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-violet-600/10 to-transparent" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0e] via-[#0c0c0e]/80 to-transparent z-1" />
            </motion.div>

            <div className="flex flex-col flex-1 p-8 relative z-10">
                <div className="flex items-start justify-between mb-8">
                    {optimizedAvatar ? (
                        <motion.div
                            whileHover={{ scale: 1.12, rotate: 3 }}
                            transition={springTransition}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <img
                                src={optimizedAvatar}
                                loading={priority ? "eager" : "lazy"}
                                fetchpriority={priority ? "high" : "auto"}
                                width="64"
                                height="64"
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover border-2 transition-colors duration-500 ${
                                    isSelected ? 'border-violet-500 shadow-[0_0_20px_rgba(217,164,63,0.4)]' : 'border-white/10 group-hover:border-violet-400/50'
                                }`}
                                alt={persona.name}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 6 }}
                            transition={springTransition}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                isSelected
                                ? 'bg-violet-600 text-black shadow-xl shadow-violet-500/30'
                                : 'bg-white/5 text-gray-400 group-hover:text-violet-400 group-hover:bg-violet-500/10'
                            }`}
                        >
                            <User size={28} strokeWidth={2.5} />
                        </motion.div>
                    )}

                    <AnimatePresence>
                      {isOwner && !persona.isSystem && (
                          <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                              <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => { e.stopPropagation(); onEdit(persona); }}
                                  className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
                                  title="Edit Persona"
                              >
                                  <Settings size={16} />
                              </motion.button>
                              <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => { e.stopPropagation(); onDelete(persona._id); }}
                                  className="p-2.5 rounded-xl bg-red-400/5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-colors border border-red-400/5"
                                  title="Delete Persona"
                              >
                                  <Trash2 size={16} />
                              </motion.button>
                          </motion.div>
                      )}
                    </AnimatePresence>
                </div>

                <div className="mt-auto">
                    <div className="mb-6">
                        <h3 className={`text-xl md:text-2xl font-black tracking-tight leading-tight transition-colors duration-300 ${
                            isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
                        }`}>{persona.name}</h3>
                        <p className="text-violet-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 group-hover:text-violet-300 transition-colors">{persona.role}</p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[13px] text-gray-400 line-clamp-2 leading-relaxed italic font-medium">
                            "{persona.speakingStyle}"
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {persona.personalityTraits?.slice(0, 3).map((trait, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    viewport={{ once: true }}
                                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap"
                                >
                                    {trait}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Selection pulse indicator */}
            <AnimatePresence>
              {isSelected && (
                  <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-8 right-8 w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(217,164,63,0.8)] z-20"
                  />
              )}
            </AnimatePresence>
        </motion.div>
    );
});

export default PersonaCard;
