import React, { useState } from 'react';
import { Plus, Sparkles, User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContextShared';
import { toast } from 'react-toastify';
import { scaleIn, staggerContainer, staggerItem, springTransition } from '../lib/motion';

const Header = React.memo(({ onNewChat, onShowHistory }) => {
  const { user, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getInitials = () => {
    if (user && user.fullName) {
        const first = user.fullName.firstName || "";
        const last = user.fullName.lastName || "";
        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }
    return "U";
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...springTransition, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-center z-50 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center glass-panel px-4 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-4xl pointer-events-auto shadow-2xl">
        <div
          onClick={() => window.location.href = '/'}
          className="group flex items-center gap-2 md:gap-4 cursor-pointer"
        >
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={springTransition}
            className="w-8 h-8 md:w-11 md:h-11 bg-white rounded-xl md:rounded-[18px] flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] ring-1 ring-white/20"
          >
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-black fill-black/10" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-white font-black text-base md:text-2xl tracking-tighter leading-none text-vibrant-gradient">ROLEPILOT</span>
            <span className="text-[7px] md:text-[9px] text-violet-400 font-black tracking-[0.4em] uppercase opacity-90 mt-1">Studio AI</span>
          </div>
        </div>

        <div className='flex items-center gap-2 md:gap-6'>
          <motion.button
            onClick={onNewChat}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-linear-to-r from-white to-gray-100 text-black rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold shadow-lg group"
            title="Start New Session"
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:scale-110" strokeWidth={3} />
            <span className="hidden xs:inline">New Session</span>
          </motion.button>

          {user && <div className="h-6 md:h-8 w-px bg-white/10 hidden xs:block" />}

          {user ? (
            <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-9 md:h-11 px-2 md:px-4 flex items-center gap-2 md:gap-3 bg-white/5 hover:bg-white/10 text-white rounded-xl md:rounded-2xl transition-colors duration-300 border border-white/5 hover:border-white/10"
                >
                   <div className="w-7 h-7 md:w-8 md:h-8 bg-linear-to-br from-violet-500 to-indigo-600 text-white rounded-lg md:rounded-xl flex items-center justify-center text-[9px] md:text-[10px] font-black shadow-lg shadow-violet-500/20 overflow-hidden">
                    {user.profilePic ? (
                        <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        getInitials()
                    )}
                   </div>
                   <span className="hidden sm:inline text-xs font-bold text-gray-300">{user.fullName?.firstName}</span>
                   <motion.div
                     animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                     transition={{ duration: 0.3 }}
                   >
                     <ChevronDown size={12} className="text-gray-500" />
                   </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      variants={scaleIn}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={springTransition}
                      style={{ transformOrigin: "top right" }}
                      className="absolute right-0 mt-3 md:mt-4 w-60 md:w-72 bg-[#0a0a0c] border border-white/5 rounded-2xl md:rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden z-50"
                    >
                        <div className="p-4 md:p-6 border-b border-white/5 bg-white/2">
                            <p className="text-xs md:text-sm font-bold text-white truncate">{user.fullName?.firstName} {user.fullName?.lastName}</p>
                            <div className="flex items-center gap-2 mt-1.5 md:mt-2">
                                <div className="max-w-full truncate px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] md:text-[10px] font-semibold text-violet-300 lowercase tracking-normal">{user.email}</div>
                            </div>
                        </div>
                        <motion.div
                          variants={staggerContainer}
                          initial="initial"
                          animate="animate"
                          className="p-1.5 md:p-2 space-y-1"
                        >
                            <motion.button
                                variants={staggerItem}
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    if(window.onManagePersonas) window.onManagePersonas();
                                }}
                                className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 text-[11px] md:text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl md:rounded-2xl transition-all duration-200 text-left group"
                            >
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                                    <Sparkles size={14} className="text-violet-400" />
                                </div>
                                <span className="font-bold text-[10px] md:text-xs uppercase tracking-widest">Manage Roles</span>
                            </motion.button>
                            <motion.div variants={staggerItem}>
                              <Link
                                  to="/profile"
                                  onClick={() => setIsDropdownOpen(false)}
                                  className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 text-[11px] md:text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl md:rounded-2xl transition-all duration-200 text-left group"
                              >
                                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                      <User size={14} className="text-purple-400" />
                                  </div>
                                  <span className="font-bold text-[10px] md:text-xs uppercase tracking-widest">Profile Hub</span>
                              </Link>
                            </motion.div>
                            <motion.button
                             variants={staggerItem}
                             id='chathistory'
                             onClick={() => {
                                 onShowHistory();
                                 setIsDropdownOpen(false);
                             }}
                             className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 text-[11px] md:text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl md:rounded-2xl transition-all duration-200 text-left group">
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                    <Settings size={14} className="text-green-400" />
                                </div>
                                <span className="font-bold text-[10px] md:text-xs uppercase tracking-widest">Chat History</span>
                            </motion.button>
                            <div className="h-px bg-white/5 my-1.5 md:my-2 mx-3 md:mx-4" />
                            <motion.button
                                variants={staggerItem}
                                onClick={() => {
                                    toast.error("User logged out");
                                    logout();
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 text-[11px] md:text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 rounded-xl md:rounded-2xl transition-all duration-200 text-left group"
                            >
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-red-400/5 flex items-center justify-center group-hover:bg-red-400/10 transition-colors">
                                    <LogOut size={14} />
                                </div>
                                <span className="font-bold text-[10px] md:text-xs uppercase tracking-widest">Sign Out</span>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
          ) : (
             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
               <Link
                  to="/login"
                  className="px-4 md:px-8 py-2 md:py-3 rounded-lg md:rounded-2xl bg-white text-black font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-50 transition-all duration-500 shadow-2xl"
              >
                  Start Now
              </Link>
             </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
});

export default Header;
