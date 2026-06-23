import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContextShared';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Image as ImageIcon, Sparkles, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, springTransition, smoothTransition } from '../lib/motion';

const Profile = () => {
    const { user, login } = useUser();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [bio, setBio] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setFirstName(user.fullName?.firstName || '');
            setLastName(user.fullName?.lastName || '');
            setProfilePic(user.profilePic || '');
            setBio(user.bio || '');
            setJobTitle(user.jobTitle || '');
            setCompany(user.company || '');
        }
    }, [user, navigate]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
                firstName,
                lastName,
                profilePic,
                bio,
                jobTitle,
                company
            }, { withCredentials: true });

            if (res.status === 200) {
                toast.success('Profile updated successfully!');
                login(res.data.user);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("New passwords do not match.");
        }
        if (newPassword.length < 6) {
            return toast.error("Password should be at least 6 characters.");
        }
        setIsPasswordLoading(true);

        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/password`, {
                currentPassword,
                newPassword
            }, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.status === 200) {
                toast.success('Password updated successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setIsPasswordLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="h-screen bg-[#0c0c0e] text-white font-sans overflow-hidden flex flex-col selection:bg-violet-500/30">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0c0c0e] mesh-gradient-bg">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(255,255,255,0.06)_0%,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)]" />
            </div>

            <Header onNewChat={() => navigate('/')} />

            <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar pt-28 pb-10 px-6">
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="max-w-2xl mx-auto"
                >
                    <motion.button
                        variants={staggerItem}
                        whileHover={{ x: -4 }}
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-semibold tracking-wide">Back to Chat</span>
                    </motion.button>

                    <motion.div
                      variants={staggerItem}
                      className="premium-card rounded-3xl p-8 backdrop-blur-xl border border-white/10 bg-white/5 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-violet-500/40 to-transparent" />

                        <div className="flex items-center gap-4 mb-8">
                            <motion.div
                              whileHover={{ scale: 1.05, rotate: 3 }}
                              transition={springTransition}
                              className="p-3 bg-violet-500/10 rounded-2xl border border-violet-500/20"
                            >
                                <User className="w-6 h-6 text-violet-400" />
                            </motion.div>
                            <div>
                                <h1 className="text-2xl font-bold">Your Profile</h1>
                                <p className="text-sm text-gray-400">Manage your personal information and avatar</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
                                {/* Profile Picture Section */}
                                <div className="flex flex-col items-center gap-4">
                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      transition={springTransition}
                                      className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 bg-[#0a0a0f] shadow-xl group"
                                    >
                                        {profilePic ? (
                                            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-400">
                                                <User size={48} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                                            <ImageIcon size={24} className="text-white mb-1" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-white">Change</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </motion.div>
                                    <div className="text-xs text-gray-500 font-medium">Click image to upload</div>
                                </div>

                                {/* Details Section */}
                                <div className="flex-1 space-y-5 w-full">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all placeholder:text-gray-600"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all placeholder:text-gray-600"
                                            placeholder="Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email <span className="normal-case tracking-normal font-normal text-gray-600">(Read Only)</span></label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Bio</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all placeholder:text-gray-600 resize-none h-24 custom-scrollbar"
                                            placeholder="Tell us a bit about yourself..."
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Job Title</label>
                                            <input
                                                type="text"
                                                value={jobTitle}
                                                onChange={(e) => setJobTitle(e.target.value)}
                                                className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all placeholder:text-gray-600"
                                                placeholder="e.g. Software Engineer"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Company</label>
                                            <input
                                                type="text"
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                                className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all placeholder:text-gray-600"
                                                placeholder="e.g. Acme Inc"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-end">
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-400 text-black rounded-xl font-bold text-sm transition-colors focus:ring-2 focus:ring-violet-500/50 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>

                    <motion.div
                      variants={staggerItem}
                      className="premium-card rounded-3xl p-8 backdrop-blur-xl border border-white/10 bg-white/5 shadow-2xl relative overflow-hidden mt-8"
                    >
                        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-rose-500/40 to-transparent" />

                        <div className="flex items-center gap-4 mb-8">
                            <motion.div
                              whileHover={{ scale: 1.05, rotate: -3 }}
                              transition={springTransition}
                              className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20"
                            >
                                <Lock className="w-6 h-6 text-rose-400" />
                            </motion.div>
                            <div>
                                <h2 className="text-xl font-bold">Security</h2>
                                <p className="text-sm text-gray-400">Update your password to keep your account secure</p>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition-all placeholder:text-gray-600"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition-all placeholder:text-gray-600"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm New Password</label>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition-all placeholder:text-gray-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/10 flex justify-end">
                                <motion.button
                                    type="submit"
                                    disabled={isPasswordLoading || !currentPassword || !newPassword || !confirmPassword}
                                    whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(225,29,72,0.4)" }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm transition-colors focus:ring-2 focus:ring-rose-500/50 disabled:opacity-70 disabled:pointer-events-none shadow-[0_0_20px_rgba(225,29,72,0.3)]"
                                >
                                    {isPasswordLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Updating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            <span>Update Password</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
