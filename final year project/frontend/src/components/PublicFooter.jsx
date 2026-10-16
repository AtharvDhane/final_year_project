import React from 'react';
import { Link } from 'react-router-dom';

export const PublicFooter = () => {
  return (
    <footer className="border-t border-slate-800/80 py-12 px-6 bg-[#06080E] text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Axiom Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-slate-300">Axiom Research Engine</span>
        </div>
        <p>© 2026 Axiom Research Inc. All rights reserved.</p>
        <div className="flex items-center space-x-6 text-slate-400">
          <Link to="/about" className="hover:text-white transition">Privacy</Link>
          <Link to="/about" className="hover:text-white transition">Terms</Link>
          <Link to="/features" className="hover:text-white transition">Documentation</Link>
        </div>
      </div>
    </footer>
  );
};
