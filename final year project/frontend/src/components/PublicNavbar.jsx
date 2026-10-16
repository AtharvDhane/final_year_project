import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export const PublicNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#080B11]/80 border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Axiom Logo" className="w-10 h-10 rounded-xl" />
          <span className="text-xl font-black tracking-tight text-white">
            Axiom
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-400">
          <Link to="/about" className="hover:text-emerald-400 transition">About</Link>
          <Link to="/features" className="hover:text-emerald-400 transition">Features</Link>
          <Link to="/workflow" className="hover:text-emerald-400 transition">How it Works</Link>
          <Link to="/impact" className="hover:text-emerald-400 transition">Impact</Link>
          <Link to="/pricing" className="hover:text-emerald-400 transition">Pricing</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link 
            to="/login"
            className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-xl transition"
          >
            Sign In
          </Link>
          <Link 
            to="/signup"
            className="text-xs font-extrabold px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center space-x-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
};
