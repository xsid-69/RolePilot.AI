import React, { useState } from 'react';
import { X, Plus, Trash2, Shield, Globe } from 'lucide-react';

const PersonaModal = ({ isOpen, onClose, onSave, persona = null }) => {
    const [formData, setFormData] = useState({
        name: persona?.name || '',
        role: persona?.role || '',
        speakingStyle: persona?.speakingStyle || '',
        personalityTraits: persona?.personalityTraits || [],
        rules: persona?.rules || [],
        visibility: persona?.visibility || 'private',
        openingMessage: persona?.openingMessage || '',
        avatar: persona?.avatar || '',
        background: persona?.background || ''
    });

    const [newTrait, setNewTrait] = useState('');
    const [newRule, setNewRule] = useState('');

    if (!isOpen) return null;

    const handleAddTrait = () => {
        if (newTrait.trim()) {
            setFormData(prev => ({
                ...prev,
                personalityTraits: [...prev.personalityTraits, newTrait.trim()]
            }));
            setNewTrait('');
        }
    };

    const handleRemoveTrait = (index) => {
        setFormData(prev => ({
            ...prev,
            personalityTraits: prev.personalityTraits.filter((_, i) => i !== index)
        }));
    };

    const handleAddRule = () => {
        if (newRule.trim()) {
            setFormData(prev => ({
                ...prev,
                rules: [...prev.rules, newRule.trim()]
            }));
            setNewRule('');
        }
    };

    const handleRemoveRule = (index) => {
        setFormData(prev => ({
            ...prev,
            rules: prev.rules.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1a1d24] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-xl font-semibold text-white">
                        {persona ? 'Edit Persona' : 'Create New Persona'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Persona Name</label>
                            <input 
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g. Sherlock Holmes"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Role</label>
                            <input 
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                placeholder="e.g. Consulting Detective"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Avatar URL</label>
                            <input 
                                type="text"
                                value={formData.avatar}
                                onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                                placeholder="https://unsplash.com/..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Background Image URL</label>
                            <input 
                                type="text"
                                value={formData.background}
                                onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
                                placeholder="https://unsplash.com/..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Opening Message</label>
                        <textarea 
                            value={formData.openingMessage}
                            onChange={(e) => setFormData(prev => ({ ...prev, openingMessage: e.target.value }))}
                            placeholder="e.g. Hello! I'm Sherlock. What mystery can I help you solve today?"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors h-20 resize-none text-sm"
                        />
                        <p className="text-[10px] text-gray-500">This message will be shown when a new chat starts with this persona.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Speaking Style</label>
                        <textarea 
                            value={formData.speakingStyle}
                            onChange={(e) => setFormData(prev => ({ ...prev, speakingStyle: e.target.value }))}
                            placeholder="e.g. Highly analytical, dismissive of obvious facts, and uses sophisticated vocabulary."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors h-24 resize-none"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-400">Personality Traits</label>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={newTrait}
                                onChange={(e) => setNewTrait(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTrait())}
                                placeholder="Add trait..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                            />
                            <button 
                                type="button"
                                onClick={handleAddTrait}
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.personalityTraits.map((trait, idx) => (
                                <span key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-medium">
                                    {trait}
                                    <button onClick={() => handleRemoveTrait(idx)} className="hover:text-red-400">
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-400">Behavioral Rules</label>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={newRule}
                                onChange={(e) => setNewRule(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRule())}
                                placeholder="Add a rule for the AI..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                            />
                            <button 
                                type="button"
                                onClick={handleAddRule}
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.rules.map((rule, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300">
                                    <span className="flex-1">{rule}</span>
                                    <button onClick={() => handleRemoveRule(idx)} className="p-1 hover:bg-white/10 rounded-md text-gray-500 hover:text-red-400 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-400">Visibility</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, visibility: 'private' }))}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                                    formData.visibility === 'private' 
                                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-100' 
                                    : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                                }`}
                            >
                                <Shield size={16} />
                                <span className="text-sm font-medium">Private</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, visibility: 'public' }))}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                                    formData.visibility === 'public' 
                                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-100' 
                                    : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                                }`}
                            >
                                <Globe size={16} />
                                <span className="text-sm font-medium">Public</span>
                            </button>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-[#16181d] flex gap-3">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={!formData.name || !formData.role || !formData.speakingStyle}
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                        {persona ? 'Save Changes' : 'Create Persona'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PersonaModal;
