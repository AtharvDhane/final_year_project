import React, { useState, useEffect } from 'react';
import { History, FileText, Calendar, X, Sparkles, Clock, Copy, Check, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { historyService } from '../services/historyService';

/* ── Strip markdown symbols for plain-text preview ──────────── */
const strip = (t = '') =>
  t.replace(/#{1,6}\s+/g, '').replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
   .replace(/`{1,3}[^`]*`{1,3}/g, '').replace(/\|[^\n]+\|/g, '')
   .replace(/[-_]{3,}/g, '').replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
   .replace(/>\s+/g, '').replace(/\n{2,}/g, ' ').replace(/\s{2,}/g, ' ').trim();

/* ── Shared Markdown components (dark theme) ─────────────────── */
const MD = {
  h1: ({ c }) => <h1 className="text-xl font-black text-white mt-6 mb-3 pb-2 border-b border-white/10">{c}</h1>,
  h2: ({ children }) => <h2 className="text-lg font-black text-slate-100 mt-5 mb-2 pb-1.5 border-b border-white/8">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-black text-emerald-400 mt-4 mb-2">{children}</h3>,
  h4: ({ children }) => <h4 className="text-sm font-extrabold text-teal-400 mt-3 mb-1.5">{children}</h4>,
  p:  ({ children }) => <p className="text-sm text-slate-300 leading-relaxed mb-3">{children}</p>,
  strong: ({ children }) => <strong className="font-extrabold text-white">{children}</strong>,
  em:     ({ children }) => <em className="italic text-slate-400">{children}</em>,
  ul: ({ children }) => <ul className="space-y-1.5 mb-3 ml-2">{children}</ul>,
  ol: ({ children }) => <ol className="space-y-1.5 mb-3 ml-4 list-decimal list-outside">{children}</ol>,
  li: ({ children }) => (
    <li className="text-sm text-slate-300 leading-relaxed flex items-start gap-2.5">
      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
      <span>{children}</span>
    </li>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 rounded-xl border border-white/10">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-emerald-500/10 border-b border-emerald-500/20">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-white/5">{children}</tbody>,
  tr:    ({ children }) => <tr className="hover:bg-white/3 transition">{children}</tr>,
  th: ({ children }) => <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-emerald-400">{children}</th>,
  td: ({ children }) => <td className="px-4 py-2.5 text-sm text-slate-300 font-medium">{children}</td>,
  code: ({ inline, children, className }) => inline
    ? <code className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-mono text-[12px] border border-emerald-500/20">{children}</code>
    : (
      <div className="my-3 rounded-xl overflow-hidden border border-white/10">
        <div className="px-4 py-2 bg-white/5 text-[10px] font-black text-slate-500 uppercase">{className?.replace('language-', '') || 'code'}</div>
        <pre className="p-4 bg-black/30 overflow-x-auto"><code className="text-[12px] font-mono text-emerald-300 leading-relaxed">{children}</code></pre>
      </div>
    ),
  pre: ({ children }) => <>{children}</>,
  blockquote: ({ children }) => (
    <blockquote className="my-3 pl-4 border-l-4 border-emerald-500/50 bg-emerald-500/5 rounded-r-xl py-2 pr-3 text-sm text-slate-400 italic">{children}</blockquote>
  ),
  hr: () => <hr className="my-4 border-0 border-t border-white/10" />,
  a:  ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold underline underline-offset-2 hover:text-teal-300 transition">{children}</a>
  ),
};

/* ── Modal ──────────────────────────────────────────────────── */
const Modal = ({ item, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(item.outputResult);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="glass-panel border border-white/10 w-full max-w-4xl max-h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between bg-emerald-500/5">
          <div>
            <h3 className="font-black text-white">{item.toolName}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3" />
              {new Date(item.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              &nbsp;·&nbsp;{item.inputSummary}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 text-xs font-bold transition border border-white/8">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD}>{item.outputResult}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

/* ── Main HistoryPage ───────────────────────────────────────── */
export const HistoryPage = ({ title = 'My AI Generations' }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try { setHistory(await historyService.getHistory()); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">{title}</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Click any card to view the full AI-generated output</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
          <Sparkles className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs font-bold">Loading generations...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="glass-panel border-2 border-dashed border-white/10 rounded-2xl py-20 flex flex-col items-center gap-3 text-slate-500">
          <FileText className="w-12 h-12 opacity-20" />
          <p className="text-sm font-black text-slate-400">No generations yet</p>
          <p className="text-xs font-medium text-slate-600">Use any AI tool to create your first generation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item) => {
            const preview = strip(item.outputResult).substring(0, 160);
            return (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="group glass-panel border border-white/8 hover:border-emerald-500/30 rounded-2xl p-5 text-left space-y-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/5"
              >
                {/* Badge + Date */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 truncate">
                    {item.toolName}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] text-slate-600 font-bold shrink-0">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Input Summary */}
                <p className="text-sm font-bold text-slate-200 line-clamp-2 leading-snug">
                  {item.inputSummary}
                </p>

                {/* Clean Preview */}
                <p className="text-xs text-slate-500 font-medium line-clamp-3 leading-relaxed bg-white/3 rounded-xl px-3.5 py-3 border border-white/5">
                  {preview}{preview.length >= 160 ? '…' : ''}
                </p>

                {/* Hover CTA */}
                <div className="flex justify-end pt-1">
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 opacity-0 group-hover:opacity-100 transition">
                    View Full <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
