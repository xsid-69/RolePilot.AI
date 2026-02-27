import React from 'react';
import { User, Settings, Trash2, Check } from 'lucide-react';

const PersonaCard = React.memo(({ persona, onSelect, onEdit, onDelete, isSelected, isOwner, priority = false }) => {
    // Built-in image optimization for Unsplash - Aggressive compression for Web Vitals
    const optimizedBg = persona.background ? `${persona.background}` : null;
    const optimizedAvatar = persona.avatar ? `${persona.avatar}` : null;

    return (
        <div 
            onClick={() => onSelect(persona)}
            className={`premium-card group h-full rounded-[32px] cursor-pointer transition-all duration-500 ease-out select-none min-h-[360px] flex flex-col ${
                isSelected 
                ? 'ring-2 ring-violet-500/50 shadow-[0_20px_40px_rgba(124,58,237,0.15)] scale-[1.02] bg-surface-high' 
                : 'hover:scale-[1.02] hover:bg-surface-mid'
            }`}
        >
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0 transition-all duration-700 group-hover:scale-105">
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
            </div>

            <div className="flex flex-col flex-1 p-8 relative z-10">
                <div className="flex items-start justify-between mb-8">
                    {optimizedAvatar ? (
                        <div className="relative">
                            <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <img 
                                src={optimizedAvatar} 
                                loading={priority ? "eager" : "lazy"}
                                fetchpriority={priority ? "high" : "auto"}
                                width="64"
                                height="64"
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover border-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                                    isSelected ? 'border-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.4)]' : 'border-white/10 group-hover:border-violet-400/50'
                                }`} 
                                alt={persona.name}
                            />
                        </div>
                    ) : (
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                            isSelected 
                            ? 'bg-violet-600 text-white shadow-xl shadow-violet-500/30' 
                            : 'bg-white/5 text-gray-400 group-hover:text-violet-400 group-hover:bg-violet-500/10'
                        }`}>
                            <User size={28} strokeWidth={2.5} className={isSelected ? 'animate-pulse' : ''} />
                        </div>
                    )}

                    {isOwner && !persona.isSystem && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onEdit(persona); }}
                                className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                                title="Edit Persona"
                            >
                                <Settings size={16} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(persona._id); }}
                                className="p-2.5 rounded-xl bg-red-400/5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all border border-red-400/5"
                                title="Delete Persona"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
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
                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap">
                                    {trait}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Indicator */}
            {isSelected && (
                <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(124,58,237,0.8)] z-20" />
            )}
        </div>
    );
});

export default PersonaCard;
