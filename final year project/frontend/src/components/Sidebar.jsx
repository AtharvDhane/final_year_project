import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, Brain, Settings, ShieldAlert, Zap, Globe, UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DocumentUploadModal } from './DocumentUploadModal';

export const Sidebar = () => {
  const { user } = useAuth();
  const [uploadOpen, setUploadOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Documents', path: '/documents', icon: FileText },
    { name: 'AI Chat RAG', path: '/chat', icon: MessageSquare },
    { name: 'AI Study Tools', path: '/tools', icon: Brain },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Home Website', path: '/', icon: Globe },
  ];

  if (user && user.role === 'ROLE_ADMIN') {
    navItems.push({ name: 'Admin Control', path: '/admin', icon: ShieldAlert });
  }

  return (
    <>
      <aside 
        className="w-64 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-6rem)] m-4 rounded-3xl p-4 shadow-xl shadow-emerald-500/5"
      >
        <div className="space-y-2">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500/80 dark:text-cyan-400/80">
            Core Workspace
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-3 rounded-2xl font-bold text-xs tracking-wide transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:text-emerald-500 dark:hover:text-cyan-400'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Upload Document Button */}
          <button
            onClick={() => setUploadOpen(true)}
            className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl font-bold text-xs tracking-wide text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-300 mt-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* System Engine Widget */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-cyan-950/40 border border-emerald-500/20 p-4 rounded-2xl space-y-2 shadow-inner">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <p className="text-xs font-black tracking-wide text-white">Groq Llama 3.3 70B</p>
            </div>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
              Local AllMiniLM Vector Store Active
            </p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 h-full w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </aside>

      <DocumentUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploadSuccess={() => setUploadOpen(false)}
      />
    </>
  );
};
