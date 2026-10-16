import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { DocumentUploadModal } from '../components/DocumentUploadModal';
import {
  LayoutDashboard, FileQuestion, BookOpen, Calendar,
  Activity, CheckCircle, Presentation, History,
  LogOut, FolderOpen, Settings, UploadCloud
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard',        path: '/teacher',              icon: LayoutDashboard },
  { name: 'Question Paper',   path: '/teacher/question-paper',icon: FileQuestion },
  { name: 'Assignment',       path: '/teacher/assignment',   icon: BookOpen },
  { name: 'Lesson Plan',      path: '/teacher/lesson-plan',  icon: Calendar },
  { name: 'Performance',      path: '/teacher/performance',  icon: Activity },
  { name: 'Evaluation',       path: '/teacher/evaluation',   icon: CheckCircle },
  { name: 'Teaching Material',path: '/teacher/material',     icon: Presentation },
  { name: 'My Generations',   path: '/teacher/history',      icon: History },
];

const BOTTOM_ITEMS = [
  { name: 'My Documents', path: '/documents', icon: FolderOpen },
  { name: 'Settings',     path: '/settings',  icon: Settings },
];

export const TeacherLayout = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const navigate = useNavigate();

  const linkCls = (active) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 ${
      active
        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
    }`;

  return (
    <div className="min-h-screen flex flex-col text-slate-100">
      <Navbar onOpenUploadModal={() => setUploadOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="hidden md:flex w-60 flex-col shrink-0 m-3 rounded-2xl glass-panel border border-white/10 overflow-hidden">
          {/* Label */}
          <div className="px-4 pt-5 pb-3">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/70">Teacher</p>
          </div>

          {/* Main Nav */}
          <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/teacher'}
                className={({ isActive }) => linkCls(isActive)}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="px-2 pb-3 pt-3 border-t border-white/8 space-y-0.5">
            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl font-bold text-xs text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 transition-all duration-200"
            >
              <UploadCloud className="w-4 h-4 shrink-0" />
              <span>Upload Document</span>
            </button>

            {BOTTOM_ITEMS.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => linkCls(isActive)}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{name}</span>
              </NavLink>
            ))}

            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl font-bold text-xs text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Exit Workspace</span>
            </button>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-4 py-6">
            <Outlet />
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
