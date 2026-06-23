import React, { useState } from 'react';
import { X, Plus, Trash2, Shield, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { scaleIn, staggerContainer, staggerItem, springTransition } from '../lib/motion';

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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                variants={scaleIn}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={springTransition}
                className="bg-[#1a1d24] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-xl font-semibold text-white">
                        {persona ? 'Edit Persona' : 'Create New Persona'}
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </motion.button>
                </div>

                {/* Form */}
                <motion.form
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
                >
                    <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Persona Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g. Sherlock Holmes"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
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
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
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
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Background Image URL</label>
                            <input
                                type="text"
                                value={formData.background}
                                onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
                                placeholder="https://unsplash.com/..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={staggerItem} className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Opening Message</label>
                        <textarea
                            value={formData.openingMessage}
                            onChange={(e) => setFormData(prev => ({ ...prev, openingMessage: e.target.value }))}
                            placeholder="e.g. Hello! I'm Sherlock. What mystery can I help you solve today?"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all h-20 resize-none text-sm"
                        />
                        <p className="text-[10px] text-gray-500">This message will be shown when a new chat starts with this persona.</p>
                    </motion.div>

                    <motion.div variants={staggerItem} className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Speaking Style</label>
                        <textarea
                            value={formData.speakingStyle}
                            onChange={(e) => setFormData(prev => ({ ...prev, speakingStyle: e.target.value }))}
                            placeholder="e.g. Highly analytical, dismissive of obvious facts, and uses sophisticated vocabulary."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all h-24 resize-none"
                            required
                        />
                    </motion.div>

                    <motion.div variants={staggerItem} className="space-y-4">
                        <label className="text-sm font-medium text-gray-400">Personality Traits</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTrait}
                                onChange={(e) => setNewTrait(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTrait())}
                                placeholder="Add trait..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all"
                            />
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddTrait}
                                className="p-2 bg-violet-500 hover:bg-violet-600 text-black rounded-xl transition-colors"
                            >
                                <Plus size={20} />
                            </motion.button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {formData.personalityTraits.map((trait, idx) => (
                                    <motion.span
                                        key={trait + idx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-lg text-xs font-medium"
                                    >
                                        {trait}
                                        <button onClick={() => handleRemoveTrait(idx)} className="hover:text-red-400 transition-colors">
                                            <X size={12} />
                                        </button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <motion.div variants={staggerItem} className="space-y-4">
                        <label className="text-sm font-medium text-gray-400">Behavioral Rules</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newRule}
                                onChange={(e) => setNewRule(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRule())}
                                placeholder="Add a rule for the AI..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all"
                            />
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddRule}
                                className="p-2 bg-violet-500 hover:bg-violet-600 text-black rounded-xl transition-colors"
                            >
                                <Plus size={20} />
                            </motion.button>
                        </div>
                        <div className="space-y-2">
                            <AnimatePresence>
                                {formData.rules.map((rule, idx) => (
                                    <motion.div
                                        key={rule + idx}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300"
                                    >
                                        <span className="flex-1">{rule}</span>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleRemoveRule(idx)}
                                            className="p-1 hover:bg-white/10 rounded-md text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <motion.div variants={staggerItem} className="space-y-3">
                        <label className="text-sm font-medium text-gray-400">Visibility</label>
                        <div className="grid grid-cols-2 gap-4">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setFormData(prev => ({ ...prev, visibility: 'private' }))}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                                    formData.visibility === 'private'
                                    ? 'bg-violet-500/10 border-violet-500/50 text-violet-100'
                                    : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                                }`}
                            >
                                <Shield size={16} />
                                <span className="text-sm font-medium">Private</span>
                            </motion.button>
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setFormData(prev => ({ ...prev, visibility: 'public' }))}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                                    formData.visibility === 'public'
                                    ? 'bg-violet-500/10 border-violet-500/50 text-violet-100'
                                    : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                                }`}
                            >
                                <Globe size={16} />
                                <span className="text-sm font-medium">Public</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.form>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-[#16181d] flex gap-3">
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={!formData.name || !formData.role || !formData.speakingStyle}
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-violet-500/50 disabled:cursor-not-allowed text-black rounded-xl font-semibold shadow-lg shadow-violet-500/20 transition-colors"
                    >
                        {persona ? 'Save Changes' : 'Create Persona'}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PersonaModal;
