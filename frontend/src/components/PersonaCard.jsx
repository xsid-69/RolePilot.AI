import React from 'react';
import { User, Settings, Trash2, Check } from 'lucide-react';

const PersonaCard = ({ persona, onSelect, onEdit, onDelete, isSelected, isOwner }) => {
    return (
        <div 
            onClick={() => onSelect(persona)}
            className={`relative group p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                isSelected 
                ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.02]' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
        >
            {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 animate-in zoom-in duration-300">
                    <Check size={14} className="text-white" />
                </div>
            )}

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                    }`}>
                        <User size={24} />
                    </div>
                    <div>
                        <h3 className={`font-semibold text-lg transition-colors ${isSelected ? 'text-blue-100' : 'text-white'}`}>
                            {persona.name}
                        </h3>
                        <p className="text-sm text-gray-400 font-medium">{persona.role}</p>
                    </div>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed italic">
                    "{persona.speakingStyle}"
                </p>

                <div className="flex flex-wrap gap-1.5 mt-1">
                    {persona.personalityTraits?.slice(0, 3).map((trait, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] text-gray-400 font-medium">
                            {trait}
                        </span>
                    ))}
                    {persona.personalityTraits?.length > 3 && (
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] text-gray-400 font-medium">
                            +{persona.personalityTraits.length - 3}
                        </span>
                    )}
                </div>

                {isOwner && !persona.isSystem && (
                    <div className="flex items-center justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(persona); }}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                            title="Edit Persona"
                        >
                            <Settings size={16} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(persona._id); }}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete Persona"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonaCard;
