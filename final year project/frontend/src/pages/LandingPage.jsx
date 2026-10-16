import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BrainCircuit, FileText, CheckCircle, Layers, Globe2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';

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

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col relative overflow-hidden">
      
      <PublicNavbar />

      {/* Hero Section with Image Background */}
      <main className="flex-grow relative flex flex-col justify-center items-center z-10 w-full min-h-[calc(100vh-80px)]">
        
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
          {/* We use the generated hero brain image here as the main background */}
          <img 
            src="/images/hero_brain.png" 
            alt="AI Brain Background" 
            className="w-full h-full object-cover opacity-30 mix-blend-screen scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080B11]/80 via-[#080B11]/50 to-[#080B11]"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-emerald-600/20 via-teal-600/10 to-cyan-500/10 rounded-full blur-[140px]"></div>
        </div>

        <motion.section 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="relative px-6 text-center space-y-8 max-w-7xl mx-auto w-full"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-extrabold text-emerald-300 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Powered by Enterprise RAG & Groq Llama 3.3 70B</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1] drop-shadow-2xl">
            Research Smarter. <br />
            Learn Faster. <span className="text-gradient-accent">Powered by Axiom.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Upload research papers, textbooks, and lecture notes. Ask questions, generate study suites, and extract exact page citations in seconds.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/30 flex items-center justify-center space-x-3 transition active:scale-95"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.section>
      </main>

      {/* Interactive UI Mockup Section */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        className="py-24 px-6 max-w-7xl mx-auto space-y-12 relative z-10"
      >
        <div className="text-center space-y-4">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Experience the Magic</span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Chat with your documents in real-time.
          </h2>
        </div>

        <motion.div variants={fadeUp} className="max-w-5xl mx-auto pt-8">
          <div className="glass-panel rounded-3xl p-3 sm:p-5 border border-slate-800/80 shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-400"></div>
            
            {/* Mockup Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-slate-500 ml-2 font-mono text-[10px]">Deep_Learning_Quantum_Physics.pdf</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black">
                INDEXED (24 Chunks)
              </span>
            </div>

            {/* Split Screen Mockup Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-left">
              {/* PDF Preview Mockup */}
              <div className="md:col-span-5 bg-slate-950/80 rounded-2xl p-4 border border-slate-800/60 space-y-3 hidden md:block text-xs">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/60 pb-2">
                  <span className="font-bold text-slate-200">Source Document</span>
                  <span>Page 4 of 18</span>
                </div>
                <div className="space-y-2 text-slate-400 text-[11px] leading-relaxed">
                  <p className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-slate-200">
                    <span className="text-emerald-400 font-bold">[Page 4]</span> Quantum superposition allows qubits to evaluate multiple combinatorial parameters simultaneously, offering quadratic speedup in RAG matrix search...
                  </p>
                  <p>
                    Classical neural networks require explicit backpropagation loops across millions of weights, whereas quantum-assisted tensor operations preserve high-dimensional manifold topology.
                  </p>
                </div>
              </div>

              {/* Chat RAG Mockup */}
              <div className="md:col-span-7 bg-slate-900/90 rounded-2xl p-4 border border-slate-800/60 space-y-3 text-xs">
                <div className="flex items-center space-x-2 text-slate-300 font-bold border-b border-slate-800/60 pb-2">
                  <BrainCircuit className="w-4 h-4 text-emerald-400" />
                  <span>Axiom Assistant</span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 text-slate-300">
                    What is the primary speedup advantage of quantum neural tensor search?
                  </div>
                  
                  <div className="bg-emerald-600/15 p-3 rounded-xl border border-emerald-500/30 text-slate-200 space-y-2">
                    <p>
                      According to the uploaded paper, quantum superposition allows evaluating multiple parameters simultaneously, yielding a <strong>quadratic speedup</strong> in vector matrix operations <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">Page 4</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Bento Grid Highlights */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        className="py-24 px-6 max-w-7xl mx-auto space-y-12 relative z-10 border-t border-slate-800/80"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={fadeUp} className="md:col-span-2 glass-panel p-10 rounded-3xl space-y-6 bg-gradient-to-br from-slate-900 to-slate-900/50">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-2">Intelligent Document RAG</h3>
              <p className="text-slate-400 leading-relaxed">
                Upload massive PDFs and instantly ask complex questions. The engine scans thousands of pages in milliseconds and provides exact citations back to the source text.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="glass-panel p-10 rounded-3xl space-y-6 bg-slate-900/50">
             <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white mb-2">3D Flashcards</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automatically generate active recall decks from your syllabus.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="glass-panel p-10 rounded-3xl space-y-6 bg-slate-900/50">
             <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white mb-2">Quiz Runner</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Test your knowledge with auto-generated 20 MCQ tests based purely on your uploaded files.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="md:col-span-2 glass-panel p-10 rounded-3xl flex items-center justify-between bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border border-emerald-500/20">
            <div>
              <h3 className="text-2xl font-black text-white mb-2">Explore all capabilities</h3>
              <p className="text-slate-400">Translation, Chapter Summaries, and 100MB Vector Storage.</p>
            </div>
            <Link to="/features" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition">
              View Features
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Trusted By / Social Proof */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        className="py-20 bg-[#06080E] border-t border-slate-800/80 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Trusted by scholars worldwide</span>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center space-x-2 text-xl font-black"><Globe2 className="w-6 h-6"/><span>Global Uni</span></div>
             <div className="flex items-center space-x-2 text-xl font-black"><CheckCircle className="w-6 h-6"/><span>IvyLeague Tech</span></div>
             <div className="flex items-center space-x-2 text-xl font-black"><Zap className="w-6 h-6"/><span>Research Institute</span></div>
             <div className="flex items-center space-x-2 text-xl font-black"><Layers className="w-6 h-6"/><span>Oxford Labs</span></div>
          </div>
        </div>
      </motion.section>

      {/* Grand CTA Banner */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }} viewport={{ once: true }}
        className="py-24 px-6 max-w-7xl mx-auto relative z-10"
      >
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-10 sm:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.1] mb-6 drop-shadow-xl text-white">
            Research Smarter. <br />
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 animate-gradient bg-[length:200%_auto]">Axiom</span>
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto relative z-10 font-medium drop-shadow-md">
            Join thousands of scholars and students saving 30+ hours every month. Stop reading endlessly, start discovering instantly.
          </p>
          <div className="pt-4 relative z-10">
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 px-10 py-5 rounded-2xl bg-white text-emerald-950 font-black text-sm uppercase tracking-wider shadow-2xl hover:scale-105 transition active:scale-95"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5 text-emerald-900" />
            </Link>
          </div>
        </div>
      </motion.section>

      <PublicFooter />
      
    </div>
  );
};
