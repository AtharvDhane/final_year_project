import React from 'react';
import { Loader2, ArrowRight, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ─────────────────────────────────────────────────────────────
   Markdown Renderer — using site's dark glass theme
───────────────────────────────────────────────────────────── */
const MD = {
  h1: ({ children }) => (
    <h1 className="text-xl font-black text-white mt-6 mb-3 pb-2 border-b border-white/10 text-gradient-hero">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-black text-slate-100 mt-5 mb-2 pb-1.5 border-b border-white/8">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-black text-emerald-400 mt-4 mb-2">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-extrabold text-teal-400 mt-3 mb-1.5">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-sm text-slate-300 leading-relaxed mb-3">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-extrabold text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-slate-400">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="space-y-1.5 mb-3 ml-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-1.5 mb-3 ml-4 list-decimal list-outside">{children}</ol>
  ),
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
  thead: ({ children }) => (
    <thead className="bg-emerald-500/10 border-b border-emerald-500/20">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-white/5">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-white/3 transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-emerald-400">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-sm text-slate-300 font-medium">{children}</td>
  ),
  code: ({ inline, children, className }) =>
    inline ? (
      <code className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-mono text-[12px] border border-emerald-500/20">
        {children}
      </code>
    ) : (
      <div className="my-3 rounded-xl overflow-hidden border border-white/10">
        <div className="px-4 py-2 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {className?.replace('language-', '') || 'code'}
        </div>
        <pre className="p-4 bg-black/30 overflow-x-auto">
          <code className="text-[12px] font-mono text-emerald-300 leading-relaxed">{children}</code>
        </pre>
      </div>
    ),
  pre: ({ children }) => <>{children}</>,
  blockquote: ({ children }) => (
    <blockquote className="my-3 pl-4 border-l-4 border-emerald-500/50 bg-emerald-500/5 rounded-r-xl py-2 pr-3 text-sm text-slate-400 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-0 border-t border-white/10" />,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-emerald-400 font-bold underline underline-offset-2 hover:text-teal-300 transition">
      {children}
    </a>
  ),
};

/* ─────────────────────────────────────────────────────────────
   Result Panel
───────────────────────────────────────────────────────────── */
const ResultPanel = ({ result, icon: Icon }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!result) {
    return (
      <div className="h-full min-h-[480px] flex flex-col items-center justify-center text-slate-600 space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
          <Icon className="w-8 h-8 text-emerald-500/30" />
        </div>
        <p className="text-xs font-bold text-slate-500 text-center max-w-xs">
          Your AI-generated result will appear here.<br />Fill out the form and submit to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Result</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 text-xs font-bold transition border border-white/8 hover:border-emerald-500/30"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Rendered Markdown */}
      <div className="text-sm leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD}>
          {result}
        </ReactMarkdown>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   AIToolInterface — Main Export
───────────────────────────────────────────────────────────── */
export const AIToolInterface = ({
  icon: Icon,
  title,
  description,
  inputs,
  onSubmit,
  loading,
  result,
  buttonText = 'Generate',
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">{title}</h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>

      {/* ── Two-column Layout ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left: Form */}
        <div className="lg:col-span-4">
          <div className="glass-panel rounded-2xl border border-white/10 p-5 sticky top-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Configure</p>
            <form onSubmit={onSubmit} className="space-y-4">
              {inputs}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 glow-teal-button"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Result */}
        <div className="lg:col-span-8">
          <div className="glass-panel rounded-2xl border border-white/10 p-6 min-h-[520px]">
            <ResultPanel result={result} icon={Icon} />
          </div>
        </div>
      </div>
    </div>
  );
};
