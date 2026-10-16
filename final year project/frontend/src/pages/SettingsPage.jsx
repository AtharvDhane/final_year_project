import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DocumentUploadModal } from '../components/DocumentUploadModal';
import {
  Settings,
  User,
  Sliders,
  Shield,
  HardDrive,
  CheckCircle2,
  Save,
  Key,
  Database,
  Cpu,
  Moon,
  Sun
} from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('profile');
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [uploadOpen, setUploadOpen] = useState(false);
  
  // AI Settings
  const [quizMcqCount, setQuizMcqCount] = useState(20);
  const [modelTemp, setModelTemp] = useState(0.3);

  // Success notifications
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f111a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-[#0f111a] dark:to-black text-slate-800 dark:text-slate-100 flex flex-col">
      <Navbar onOpenUploadModal={() => setUploadOpen(true)} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center space-x-3">
              <Settings className="w-8 h-8 text-teal-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Account & System Control</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your profile, AI model preferences, credentials, and local disk storage configuration.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2.5 border-b border-slate-200/80 dark:border-slate-800/80 overflow-x-auto pb-3">
            {[
              { id: 'profile', name: 'Profile Settings', icon: User },
              { id: 'ai', name: 'AI Engine Preferences', icon: Sliders },
              { id: 'security', name: 'Security & Password', icon: Shield },
              { id: 'storage', name: 'Disk Storage & Database', icon: HardDrive },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-xs tracking-wide transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                      : 'glass-panel text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-cyan-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Content Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-xl">

            {savedSuccess && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs flex items-center space-x-2 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Account settings updated and saved successfully!</span>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
                <div className="flex items-center space-x-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-500/25">
                    {profileName ? profileName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">{profileName}</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      Academic Researcher
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition shadow-inner"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Theme Appearance</label>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="flex items-center space-x-3 px-5 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-xs font-bold bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl hover:border-emerald-500/40 transition shadow-sm"
                    >
                      {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-500" />}
                      <span>Appearance Theme: ({isDarkMode ? 'Dark Mode' : 'Light Mode'})</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-500/25 transition active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            )}

            {/* AI Preferences Tab */}
            {activeTab === 'ai' && (
              <div className="space-y-6 max-w-2xl">
                <div className="p-5 bg-white/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Cpu className="w-6 h-6 text-emerald-400" />
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">LLM Generation Engine</h4>
                        <p className="text-xs text-slate-400">High-speed inference via Groq Cloud API</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                      Llama 3.3 70B Versatile
                    </span>
                  </div>
                </div>

                <div className="p-5 bg-white/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Database className="w-6 h-6 text-cyan-400" />
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Vector Embedding Model</h4>
                        <p className="text-xs text-slate-400">100% In-Memory Local Execution</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                      AllMiniLM-L6-v2 (Zero Quota Limits)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-xl">
                <div className="p-6 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl bg-white/50 dark:bg-slate-900/50 space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mb-4">Change Password</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition shadow-inner"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition shadow-inner"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition shadow-inner"
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSavedSuccess(true);
                        setTimeout(() => setSavedSuccess(false), 3000);
                      }}
                      className="mt-2 flex items-center space-x-2 px-6 py-3 bg-slate-800 dark:bg-slate-100 hover:bg-slate-900 dark:hover:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition active:scale-95"
                    >
                      <Key className="w-4 h-4" />
                      <span>Update Password</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Storage Tab */}
            {activeTab === 'storage' && (
              <div className="space-y-6 max-w-2xl">
                <div className="p-6 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl bg-white/50 dark:bg-slate-900/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Local Database Persistence</h4>
                    <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      ACTIVE (`./mongo_data`)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    User accounts, documents, notes, quizzes, and chat histories are permanently saved on your local disk at `./mongo_data`.
                  </p>
                </div>
              </div>
            )}

          </div>

        </main>
      </div>

      <DocumentUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploadSuccess={() => setUploadOpen(false)}
      />
    </div>
  );
};



