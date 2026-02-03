import React, { useState } from 'react';
import { LayoutGrid, Sparkles, User, LogOut, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContextShared';
import { toast } from 'react-toastify';

const Header = () => {
  const { user, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getInitials = () => {
    if (user && user.fullName) {
        // Handle case where fullName might be deeply nested or just an object
        const first = user.fullName.firstName || "";
        const last = user.fullName.lastName || "";
        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }
    return "U";
  };

  return (
    <header className="fixed top-0 left-0 right-0 md:left-10 p-5 flex justify-between items-center z-10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
             <Sparkles className="w-5 h-5 text-black fill-black" />
        </div>
        <span className="text-white font-medium text-lg">Rolepilot AI</span>
      </div>
      
      <div className='flex items-center gap-3'>
        {user ? (
            <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-10 w-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 cursor-pointer border border-transparent hover:border-white/10 active:scale-95"
                >
                   {getInitials()}
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-[#0f1115] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                        <div className="p-3 border-b border-white/5 mb-1">
                            <p className="text-sm font-medium text-white truncate">{user.fullName?.firstName} {user.fullName?.lastName}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <div className="p-1">
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-left cursor-pointer active:scale-95">
                                <User size={16} />
                                View Profile
                            </button>
                            <button
                                onClick={() => {
                                    toast.error("User logged out");
                                    logout();
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200 text-left cursor-pointer active:scale-95"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        ) : (
             <Link 
                to="/login" 
                className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-all duration-200 shadow-lg shadow-white/5 active:scale-95"
            >
                Sign In
            </Link>
        )}

        <button className="p-2 text-gray-400 hover:text-white transition-all duration-200 rounded-full hover:bg-white/10 active:scale-95 cursor-pointer">
            <LayoutGrid className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
