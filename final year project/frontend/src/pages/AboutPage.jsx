import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { Sparkles, Globe2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col relative overflow-hidden">
      <PublicNavbar />
      
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img src="/images/page_bg_about.png" alt="Background" className="w-full h-[600px] object-cover opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080B11]/80 to-[#080B11]"></div>
      </div>

      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/15 to-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <main className="flex-grow pt-24 pb-20 px-6 max-w-7xl mx-auto w-full relative z-10">
        <motion.section 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="space-y-16"
        >
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-extrabold text-cyan-300 shadow-sm">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Our Mission</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Democratizing access to <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300">advanced academic research.</span>
            </motion.h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-10">
            <motion.div variants={fadeUp} className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-white">Built by Scholars, for Scholars</h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                Axiom was founded by a team of researchers and engineers who were tired of spending countless hours manually sifting through dense academic papers, searching for key formulas, and compiling study notes.
              </p>
              <p className="text-slate-400 leading-relaxed text-sm">
                We leverage state-of-the-art Large Language Models and Enterprise RAG architecture to ensure that every answer is backed by an exact, verifiable citation from your own documents.
              </p>
              
              <div className="pt-6 grid grid-cols-2 gap-6">
                <div className="space-y-1 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                  <h4 className="text-3xl font-black text-white">200K+</h4>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Users</p>
                </div>
                <div className="space-y-1 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                  <h4 className="text-3xl font-black text-white">99.2%</h4>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Citation Accuracy</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-3xl z-0"></div>
              <div className="glass-panel p-10 rounded-3xl relative z-10 border border-slate-700/50 flex flex-col space-y-6 shadow-2xl">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white">No Hallucinations</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Unlike standard ChatGPT, our engine is strictly grounded in the documents you upload. If the answer isn't in the paper, it won't invent one. We provide pinpoint page citations so you can verify everything.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <PublicFooter />
    </div>
  );
};
