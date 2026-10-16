import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FileQuestion, BookOpen, Calendar, Activity, CheckCircle, Presentation,
  ArrowRight, UploadCloud, Sparkles
} from 'lucide-react';

const FEATURES = [
  {
    name: 'Question Paper Generator',
    desc: 'Generate complete tests and exams from your syllabus in seconds.',
    path: '/teacher/question-paper',
    icon: FileQuestion,
  },
  {
    name: 'Assignment Generator',
    desc: 'Create structured student assignments from reference material.',
    path: '/teacher/assignment',
    icon: BookOpen,
  },
  {
    name: 'Lesson Plan Generator',
    desc: 'Detailed lesson plans with objectives, activities and assessments.',
    path: '/teacher/lesson-plan',
    icon: Calendar,
  },
  {
    name: 'Performance Analyzer',
    desc: 'Upload marks CSV/XLSX for AI insights on class performance.',
    path: '/teacher/performance',
    icon: Activity,
  },
  {
    name: 'Evaluation & Feedback',
    desc: 'Auto-evaluate student answers against reference model answers.',
    path: '/teacher/evaluation',
    icon: CheckCircle,
  },
  {
    name: 'Teaching Material',
    desc: 'Generate lecture notes, key points & examples from your syllabus.',
    path: '/teacher/material',
    icon: Presentation,
  },
];

export const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const first = user?.name?.split(' ')[0] || 'Teacher';

  return (
    <div className="space-y-8 animate-fade-in-up">

      {/* ── Hero Banner ──────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl glass-panel border border-emerald-500/20 p-8">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Teacher Workspace</span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight">
              Hey, <span className="text-gradient-emerald">{first} 👋</span>
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-2 max-w-lg">
              Streamline your teaching workflow with AI tools for question papers, lesson plans, evaluations, and more.
            </p>
          </div>

          <button
            onClick={() => navigate('/documents')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs hover:bg-emerald-500/20 transition shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            My Documents
          </button>
        </div>
      </div>

      {/* ── Tool Grid ────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">AI Teaching Tools</h2>
          <span className="text-xs text-slate-600 font-bold">{FEATURES.length} tools</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <button
              key={f.path}
              onClick={() => navigate(f.path)}
              className="group glass-panel border border-white/8 hover:border-emerald-500/40 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition">
                <f.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-black text-slate-100 group-hover:text-emerald-300 transition mb-1">
                {f.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {f.desc}
              </p>
              <div className="flex items-center gap-1 mt-4 text-[10px] font-black uppercase tracking-wider text-emerald-500 opacity-0 group-hover:opacity-100 transition">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tip ─────────────────────────────────────────── */}
      <div className="glass-panel border border-teal-500/20 rounded-xl px-5 py-3.5 flex items-center gap-3">
        <UploadCloud className="w-4 h-4 text-teal-400 shrink-0" />
        <p className="text-xs text-slate-400 font-medium">
          <span className="text-teal-400 font-black">Tip:</span> Upload syllabus via "Upload Document" first. For Performance Analyzer, upload CSV directly in the tool — no prior document upload needed.
        </p>
      </div>
    </div>
  );
};
