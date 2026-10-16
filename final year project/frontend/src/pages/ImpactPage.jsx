import React from 'react';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export const ImpactPage = () => {
  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col relative overflow-hidden">
      <PublicNavbar />
      
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img src="/images/page_bg_about.png" alt="Background" className="w-full h-[600px] object-cover opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080B11]/80 to-[#080B11]"></div>
      </div>

      <main className="flex-grow pt-24 pb-20 px-6 max-w-7xl mx-auto w-full z-10">
        <motion.section initial="hidden" animate="visible" variants={staggerContainer} className="space-y-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Real Impact. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">Measurable Results.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-2xl mx-auto">
              Join a global community of scholars and students transforming the way research is done.
            </motion.p>
          </div>

          <div className="glass-panel rounded-3xl p-10 md:p-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center border border-slate-800/80 mt-12 bg-slate-900/60 shadow-2xl">
            <motion.div variants={fadeUp} className="space-y-3">
              <h3 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">50M+</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Chunks Indexed</p>
            </motion.div>
            <motion.div variants={fadeUp} className="space-y-3">
              <h3 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">99.2%</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Citation Accuracy</p>
            </motion.div>
            <motion.div variants={fadeUp} className="space-y-3">
              <h3 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">10x</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Faster Research</p>
            </motion.div>
            <motion.div variants={fadeUp} className="space-y-3">
              <h3 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">200K+</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Scholars</p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
            <motion.div variants={fadeUp} className="bg-slate-900/80 border border-slate-800 p-10 rounded-3xl">
              <p className="text-lg italic text-slate-300 leading-relaxed">
                "This platform saved me over 40 hours during my thesis review. The ability to chat with my 200-page dataset and instantly generate flashcards is mind-blowing."
              </p>
              <div className="mt-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center font-bold text-lg">S</div>
                <div>
                  <h4 className="font-bold text-white">Sarah Jenkins</h4>
                  <p className="text-sm text-slate-500">PhD Candidate, Stanford</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-slate-900/80 border border-slate-800 p-10 rounded-3xl">
              <p className="text-lg italic text-slate-300 leading-relaxed">
                "The exact page citations mean I can trust the AI. It never fabricates answers, and I can verify every claim instantly before adding it to my paper."
              </p>
              <div className="mt-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center font-bold text-lg">M</div>
                <div>
                  <h4 className="font-bold text-white">Dr. Marcus Vance</h4>
                  <p className="text-sm text-slate-500">Research Lead, MIT</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>
      
      <PublicFooter />
    </div>
  );
};
