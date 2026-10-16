import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);

    try {
      const res = await signup(name, email, password, role);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden ">
      
      {/* Background Video */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-[0.08] mix-blend-screen">
          <source src="https://static.vecteezy.com/system/resources/previews/001/829/396/mp4/technology-network-loop-background-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#080B11]/80 backdrop-blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl glass-panel rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl grid grid-cols-1 md:grid-cols-12 relative z-10">
        
        {/* Left Column: Clean Signup Form */}
        <div className="md:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-6 order-2 md:order-1 bg-slate-950/90">
          
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Create an Account</h1>
            <p className="text-xs text-slate-400">Start researching smarter with AI in less than 60 seconds</p>
          </div>

          {/* Role Selection Tabs */}
          <div className="flex p-1 bg-slate-900/80 rounded-xl border border-slate-800/80">
            {['STUDENT', 'TEACHER', 'RESEARCHER'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                  role === r
                    ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-500/10 p-3.5 rounded-2xl border border-rose-500/20 font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'TEACHER' ? 'Prof. Alex Johnson' : role === 'RESEARCHER' ? 'Dr. Alex Johnson' : 'Alex Johnson'}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-emerald-500 text-xs font-bold text-white placeholder-slate-500 outline-none transition shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'TEACHER' ? 'professor@university.edu' : role === 'RESEARCHER' ? 'researcher@lab.org' : 'student@university.edu'}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-emerald-500 text-xs font-bold text-white placeholder-slate-500 outline-none transition shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-emerald-500 text-xs font-bold text-white placeholder-slate-500 outline-none transition shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50 active:scale-95 text-white"
            >
              <span>{submitting ? 'Creating Account...' : `Join as ${role.charAt(0) + role.slice(1).toLowerCase()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-800/80">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold underline">Sign in</Link>
          </div>
        </div>

        {/* Right Column: Image Branding Panel */}
        <div className="md:col-span-6 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-t md:border-t-0 md:border-l border-slate-800/80 order-1 md:order-2 min-h-[400px]">
          {/* Generated Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/auth_bg.png" 
              alt="Abstract background" 
              className="w-full h-full object-cover opacity-80 mix-blend-screen scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-slate-900/60 to-transparent"></div>
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="text-xl font-black tracking-tight text-white drop-shadow-md">
                Axiom
              </span>
            </div>

            <div className="space-y-3 pt-6 drop-shadow-xl">
              <h2 className="text-3xl font-black tracking-tight leading-tight text-white">
                Accelerate your discovery with <span className="text-cyan-300">Axiom.</span>
              </h2>
              <p className="text-xs text-slate-200/90 leading-relaxed font-medium bg-black/20 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                Join over 200,000 students, professors, and researchers saving 30+ hours every month.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
