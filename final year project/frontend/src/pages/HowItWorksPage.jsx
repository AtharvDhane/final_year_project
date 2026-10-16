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

export const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col relative overflow-hidden">
      <PublicNavbar />
      
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img src="/images/page_bg_features.png" alt="Background" className="w-full h-[600px] object-cover opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080B11]/80 to-[#080B11]"></div>
      </div>

      <main className="flex-grow pt-24 pb-20 px-6 max-w-7xl mx-auto w-full z-10">
        <motion.section initial="hidden" animate="visible" variants={staggerContainer} className="space-y-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              A Seamless <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">Workflow.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-2xl mx-auto">
              From raw documents to mastery in three simple steps.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative pt-10">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -z-10 translate-y-12"></div>
            
            <motion.div variants={fadeUp} className="glass-panel p-10 rounded-3xl text-center space-y-6 bg-slate-900/80">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white text-2xl font-black flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                1
              </div>
              <h4 className="text-2xl font-extrabold text-white">Upload Documents</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Drag & drop PDFs, Word files, PPTX presentations, or Text notes up to 100MB into your secure local workspace.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-panel p-10 rounded-3xl text-center space-y-6 bg-slate-900/80">
              <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white text-2xl font-black flex items-center justify-center mx-auto shadow-lg shadow-teal-500/30">
                2
              </div>
              <h4 className="text-2xl font-extrabold text-white">Vector Indexing</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your text is broken into semantic chunks and embedded in sub-second local vector memory for rapid contextual retrieval.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-panel p-10 rounded-3xl text-center space-y-6 bg-slate-900/80">
              <div className="w-16 h-16 rounded-2xl bg-cyan-600 text-white text-2xl font-black flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/30">
                3
              </div>
              <h4 className="text-2xl font-extrabold text-white">Chat & Learn</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ask AI questions with exact citations, generate flashcards, or launch interactive quizzes to test your knowledge immediately.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </main>
      
      <PublicFooter />
    </div>
  );
};
