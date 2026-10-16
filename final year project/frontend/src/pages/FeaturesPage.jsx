import React from 'react';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { BrainCircuit, FileText, Layers, BookOpen, Globe2, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export const FeaturesPage = () => {
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
              Powerful Features for <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">Serious Researchers.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to index, analyze, and learn from complex academic materials in a fraction of the time.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
            <motion.div variants={fadeUp} className="glass-panel p-8 rounded-3xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Intelligent Document RAG</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ask natural language questions across PDF, Word, PowerPoint, and Text files with pinpoint page citation back-links. Never lose track of your source material again.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-panel p-8 rounded-3xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Automated Quiz Runner</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Instantly convert complex textbooks into 20 interactive multiple-choice questions with instant scoring and detailed explanations. Perfect for active recall testing.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-panel p-8 rounded-3xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white">3D Flashcards</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Master hard concepts fast using interactive 3D flip flashcards extracted automatically from core document definitions and key terms.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-panel p-8 rounded-3xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Chapter Notes</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Transform massive 100-page papers into structured chapter summaries, key formulas, and high-impact revision guides ready for export.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-panel p-8 rounded-3xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Globe2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Multilingual Translation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Translate foreign research papers across 15+ global languages while preserving original technical context and formatting. Powered by Axiom Translation Engine.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-panel p-8 rounded-3xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <HardDrive className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Large Vector Storage</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Upload large textbooks up to 100MB with guaranteed sub-second in-memory vector indexing and persistent account data storage.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </main>
      
      <PublicFooter />
    </div>
  );
};
