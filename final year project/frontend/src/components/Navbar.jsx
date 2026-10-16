import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon, LogOut, User, Sparkles, BookOpen, Settings, FileText, ChevronDown, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = ({ onOpenUploadModal }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-950/75 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-lg shadow-emerald-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <img src="/logo.png" alt="Axiom Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-emerald-500/30 group-hover:scale-105 group-hover:rotate-3 transition duration-300" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
                Axiom
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-600/80 dark:text-cyan-400/80">
              AI Academic Suite
            </p>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Upload Button */}
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 transition duration-300 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Research</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-500" />}
          </button>

          {/* User Profile Account Dropdown */}
          {user && (
            <div className="relative pl-3 border-l border-slate-200 dark:border-slate-800" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition text-slate-700 dark:text-slate-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-500/20">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline text-xs font-extrabold tracking-wide">
                  {user.name}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
              </button>

              {/* Account Popup Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  
                  {/* Account Header Badge */}
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-xl mb-1">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Logged In Account</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <Link
                      to="/documents"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                    >
                      <FileText className="w-4 h-4 text-emerald-500" />
                      <span>My Research Library</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 transition"
                    >
                      <Settings className="w-4 h-4 text-teal-500" />
                      <span>Account & Preferences</span>
                    </Link>

                    {user && user.role === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition"
                      >
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <div className="flex items-center space-x-3">
                        {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-500" />}
                        <span>Appearance</span>
                      </div>
                      <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">{isDarkMode ? 'Dark' : 'Light'}</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
};


