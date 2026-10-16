import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export const PricingPage = () => {
  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col relative overflow-hidden">
      <PublicNavbar />
      
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img src="/images/page_bg_pricing.png" alt="Background" className="w-full h-[600px] object-cover opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080B11]/80 to-[#080B11]"></div>
      </div>

      <main className="flex-grow pt-24 pb-20 px-6 max-w-7xl mx-auto w-full z-10">
        <motion.section initial="hidden" animate="visible" variants={staggerContainer} className="space-y-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Flexible investments in <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">knowledge.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-2xl mx-auto">
              Start for free, upgrade when you need massive scale. Cancel anytime.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
            {/* Free Plan */}
            <motion.div variants={fadeUp} className="glass-panel p-10 rounded-3xl space-y-8 flex flex-col justify-between bg-slate-900/50">
              <div className="space-y-4">
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Starter</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-black text-white">$0</span>
                  <span className="text-sm text-slate-400 font-bold uppercase">/ forever</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">Perfect for students starting out with basic paper reading.</p>
                <ul className="space-y-4 text-sm text-slate-300 pt-6 border-t border-slate-800">
                  <li className="flex items-center space-x-3"><Check className="w-5 h-5 text-emerald-400" /><span>Up to 10MB file uploads</span></li>
                  <li className="flex items-center space-x-3"><Check className="w-5 h-5 text-emerald-400" /><span>Basic RAG question answering</span></li>
                  <li className="flex items-center space-x-3"><Check className="w-5 h-5 text-emerald-400" /><span>Standard page citations</span></li>
                  <li className="flex items-center space-x-3 text-slate-500"><Check className="w-5 h-5 text-slate-700" /><span>No 3D Flashcards</span></li>
                </ul>
              </div>
              <Link to="/signup" className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-black text-center transition shadow-md">
                Start Free
              </Link>
            </motion.div>

            {/* Pro Scholar Plan */}
            <motion.div variants={fadeUp} className="glass-panel p-10 rounded-3xl space-y-8 flex flex-col justify-between border-2 border-emerald-500 relative bg-slate-900/80 shadow-2xl shadow-emerald-900/20 md:-translate-y-6">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-black uppercase text-white tracking-widest shadow-lg">
                Most Popular
              </div>
              <div className="space-y-4 pt-4">
                <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">Pro Scholar</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-black text-white">$19</span>
                  <span className="text-sm text-slate-400 font-bold uppercase">/ month</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">For serious researchers needing unlimited study tools.</p>
                <ul className="space-y-4 text-sm text-slate-300 pt-6 border-t border-slate-800">
                  <li className="flex items-center space-x-3"><Check className="w-5 h-5 text-emerald-400" /><span>Up to 100MB file uploads</span></li>
                  <li className="flex items-center space-x-3"><Check className="w-5 h-5 text-emerald-400" /><span>Groq Llama 3.3 70B & Gemini Flash</span></li>
                  <li className="flex items-center space-x-3"><Check className="w-5 h-5 text-emerald-400" /><span>20 MCQ Quiz Runner & 3D Decks</span></li>
                  <li className="flex items-center space-x-3"><Check className="w-5 h-5 text-emerald-400" /><span>15+ Multilingual Translation</span></li>
                </ul>
              </div>
              <Link to="/signup" className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white text-sm font-black text-center uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition active:scale-95">
                Get Pro Access
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div variants={fadeUp} className="glass-panel p-10 rounded-3xl space-y-8 flex flex-col justify-between bg-slate-900/50">
              <div className="space-y-4">
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Institutional</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-black text-white">$49</span>
                  <span className="text-sm text-slate-400 font-bold uppercase">/ month</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">Dedicated compute and custom vector database models.</p>
                <ul className="space-y-4 text-sm text-slate-300 pt-6 border-t border-slate-800">
                  <li className="flex items-center space-x-3"><Check className="w-5 h-5 text-emerald-400" /><span>Dedicated Qdrant DB cluster</span></li>
                  <li className="flex items-center space-x-3"><Check className="w-5 h-5 text-emerald-400" /><span>Custom LLM fine-tuning</span></li>
                  <li className="flex items-center space-x-3"><Check className="w-5 h-5 text-emerald-400" /><span>API access & priority SLA</span></li>
                  <li className="flex items-center space-x-3"><Check className="w-5 h-5 text-emerald-400" /><span>Admin Team Dashboard</span></li>
                </ul>
              </div>
              <Link to="/signup" className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-black text-center transition shadow-md">
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>
      
      <PublicFooter />
    </div>
  );
};
