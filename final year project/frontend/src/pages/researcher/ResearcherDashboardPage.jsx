import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Microscope, Layers, Target, GitCompare, Quote, Database,
  ArrowRight, UploadCloud, Sparkles
} from 'lucide-react';

const FEATURES = [
  {
    name: 'Paper Analyzer',
    desc: 'Extract objectives, methodology & key findings from any research paper instantly.',
    path: '/researcher/paper-analyzer',
    icon: Microscope,
  },
  {
    name: 'Literature Review',
    desc: 'Synthesize multiple papers into a structured comprehensive review.',
    path: '/researcher/literature-review',
    icon: Layers,
  },
  {
    name: 'Gap Finder',
    desc: 'Identify methodological, dataset & geographical research gaps.',
    path: '/researcher/gap-finder',
    icon: Target,
  },
  {
    name: 'Paper Comparison',
    desc: 'Compare objectives, datasets & findings across papers side-by-side.',
    path: '/researcher/comparison',
    icon: GitCompare,
  },
  {
    name: 'Citation Assistant',
    desc: 'Auto-generate APA, MLA & IEEE citations from your uploaded paper.',
    path: '/researcher/citation',
    icon: Quote,
  },
  {
    name: 'Data Analyzer',
    desc: 'Upload CSV/XLSX datasets for instant AI-powered statistical insights.',
    path: '/researcher/data-analyzer',
    icon: Database,
  },
];

export const ResearcherDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const first = user?.name?.split(' ')[0] || 'Researcher';

  return (
    <div className="space-y-8 animate-fade-in-up">

      {/* ── Hero Banner ──────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl glass-panel border border-emerald-500/20 p-8">
        {/* Glow orbs */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Researcher Workspace</span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight">
              Hey, <span className="text-gradient-emerald">{first} 👋</span>
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-2 max-w-lg">
              Accelerate your academic research with AI-powered tools for analysis, synthesis, and discovery.
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
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">AI Research Tools</h2>
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
          <span className="text-teal-400 font-black">Tip:</span> Upload papers via "Upload Document" in the sidebar first, then select them inside each tool.
        </p>
      </div>
    </div>
  );
};
