import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentService } from '../services/documentService';
import { chatService } from '../services/chatService';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DocumentUploadModal } from '../components/DocumentUploadModal';
import {
  FileText, MessageSquare, Sparkles, Brain, Plus, Trash2, Edit2, CheckCircle2, Clock, ChevronRight, Activity, ArrowUpRight, UploadCloud, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const docRes = await documentService.getDocuments();
      if (docRes.success) {
        setDocuments(docRes.data || []);
      }
      const chatRes = await chatService.getChatSessions();
      if (chatRes.success) {
        setChatSessions(chatRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteDoc = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.deleteDocument(id);
        loadData();
      } catch (err) {
        alert(err.message || 'Failed to delete document');
      }
    }
  };

  const handleRenameDoc = async (doc) => {
    const newName = prompt('Enter new document name:', doc.fileName);
    if (newName && newName.trim() !== '') {
      try {
        await documentService.renameDocument(doc.id, newName.trim());
        loadData();
      } catch (err) {
        alert(err.message || 'Failed to rename document');
      }
    }
  };

  const totalChunks = documents.reduce((acc, doc) => acc + (doc.chunkCount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B11] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-[#080B11] dark:to-black text-slate-800 dark:text-slate-100 flex flex-col">
      <Navbar onOpenUploadModal={() => setIsUploadOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 space-y-8">
          <div className="max-w-[1400px] mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Welcome back, Researcher</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Here is what's happening with your projects today.</p>
              </div>
              <button 
                onClick={() => setIsUploadOpen(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-black shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <UploadCloud className="w-4 h-4 stroke-[3]" />
                <span>Upload Document</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               {/* Stat Card 1: Documents */}
             <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-emerald-500/30 transition group relative overflow-hidden">
               {/* 3D Image */}
               <img src="/images/doc_icon.png" alt="Documents" className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500" />
               <div className="relative z-10 flex justify-between items-start mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                   <FileText className="w-6 h-6" />
                 </div>
                 <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-500/20 shadow-sm">Active</span>
               </div>
               <div className="relative z-10">
                 <h3 className="text-4xl font-black text-slate-800 dark:text-white drop-shadow-md">{documents.length}</h3>
                 <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider">Total Documents</p>
               </div>
             </div>

               {/* Stat Card 2: Chunks */}
             <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-teal-500/30 transition group relative overflow-hidden">
               {/* 3D Image */}
               <img src="/images/vector_icon.png" alt="Vectors" className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500" />
               <div className="relative z-10 flex justify-between items-start mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform shadow-lg shadow-teal-500/20">
                   <Activity className="w-6 h-6" />
                 </div>
               </div>
               <div className="relative z-10">
                 <h3 className="text-4xl font-black text-slate-800 dark:text-white drop-shadow-md">{totalChunks}</h3>
                 <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider">Indexed Vector Chunks</p>
               </div>
             </div>

               {/* Stat Card 3: Chat Sessions */}
             <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-purple-500/30 transition group relative overflow-hidden">
               {/* 3D Image */}
               <img src="/images/chat_icon.png" alt="Chats" className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500" />
               <div className="relative z-10 flex justify-between items-start mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                   <MessageSquare className="w-6 h-6" />
                 </div>
               </div>
               <div className="relative z-10">
                 <h3 className="text-4xl font-black text-slate-800 dark:text-white drop-shadow-md">{chatSessions.length}</h3>
                 <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider">Chat Sessions</p>
               </div>
             </div>
            </div>

            {/* Main Split Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Left Col (2/3): Recent Documents */}
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full min-h-[400px]">
                  <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">Recent Documents</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage and chat with your indexed sources</p>
                    </div>
                    <button onClick={() => navigate('/documents')} className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-xl transition">
                      <span>View All</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {loading ? (
                    <div className="p-12 text-center text-slate-400 text-xs font-bold animate-pulse flex-grow flex items-center justify-center">Loading library...</div>
                  ) : documents.length === 0 ? (
                    <div className="p-10 flex-grow flex items-center justify-center">
                      <div className="text-center space-y-4 max-w-sm mx-auto">
                        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                          <FileText className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No documents indexed yet.</p>
                        <button
                          onClick={() => setIsUploadOpen(true)}
                          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-500/25 transition hover:bg-emerald-500"
                        >
                          Upload your first document
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800/60 text-slate-400 uppercase text-[10px] font-black tracking-widest bg-slate-50/50 dark:bg-slate-900/20">
                            <th className="py-4 px-6">Document Title</th>
                            <th className="py-4 px-6">Format</th>
                            <th className="py-4 px-6">Chunks</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                          {documents.slice(0, 5).map((doc) => {
                            let typeBg = 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20';
                            if (doc.fileType === 'DOCX') typeBg = 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
                            if (doc.fileType === 'PPTX') typeBg = 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20';
                            if (doc.fileType === 'TXT') typeBg = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';

                            return (
                              <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition group">
                                <td className="py-4 px-6 font-bold flex items-center space-x-3 text-slate-800 dark:text-slate-200">
                                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <span className="truncate max-w-[200px] sm:max-w-xs">{doc.fileName}</span>
                                </td>
                                <td className="py-4 px-6">
                                  <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black border uppercase tracking-wider ${typeBg}`}>
                                    {doc.fileType}
                                  </span>
                                </td>
                                <td className="py-4 px-6 font-mono font-bold text-slate-500 dark:text-slate-400">
                                  {doc.chunkCount}
                                </td>
                                <td className="py-4 px-6">
                                  {doc.status === 'INDEXED' ? (
                                    <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 text-[10px] font-bold tracking-wide">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>INDEXED</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 text-[10px] font-bold tracking-wide">
                                      <Clock className="w-3.5 h-3.5 animate-spin" />
                                      <span>PROCESSING</span>
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 px-6 text-right space-x-1">
                                  <button
                                    onClick={() => navigate(`/chat?documentId=${doc.id}`)}
                                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-[11px] font-black shadow-sm transition mr-2"
                                  >
                                    Chat
                                  </button>
                                  <button
                                    onClick={() => handleRenameDoc(doc)}
                                    className="p-2.5 text-slate-400 hover:text-emerald-500 transition rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                                    title="Rename File"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDoc(doc.id)}
                                    className="p-2.5 text-slate-400 hover:text-rose-500 transition rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                    title="Delete File"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Col (1/3): Quick Actions Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                 <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Quick Tools</h2>
                 
                 {/* Quick Tool 1 */}
                 <div onClick={() => navigate('/tools')} className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white cursor-pointer hover:-translate-y-1 transition-transform duration-300 shadow-xl shadow-emerald-900/20 group relative overflow-hidden">
                   <Brain className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                   <div className="relative z-10 flex flex-col space-y-4">
                     <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center">
                       <FileText className="w-7 h-7 text-white" />
                     </div>
                     <div>
                       <h3 className="font-black text-2xl tracking-tight">20 MCQ Quiz</h3>
                       <p className="text-sm text-emerald-100 mt-1 font-medium leading-relaxed">Auto-generate interactive tests from your complex papers.</p>
                     </div>
                   </div>
                 </div>

                 {/* Quick Tool 2 */}
                 <div onClick={() => navigate('/tools')} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 cursor-pointer hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group">
                   <div className="flex flex-col space-y-4">
                     <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                       <Sparkles className="w-7 h-7" />
                     </div>
                     <div>
                       <h3 className="font-black text-2xl tracking-tight text-slate-800 dark:text-white">Study Summarizer</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">Extract key findings, definitions, and mathematical formulas instantly.</p>
                     </div>
                   </div>
                 </div>
                 
                 {/* Quick Tool 3 / Callout */}
                 <div className="bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/30 rounded-3xl p-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mx-auto text-slate-500 dark:text-slate-400">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-base">Need help understanding?</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">Open any document from the library and start chatting with our AI to get detailed, cited explanations.</p>
                    </div>
                 </div>

              </div>

            </div>

          </div>
        </main>
      </div>
      
      <DocumentUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUploadSuccess={() => loadData()} />
    </div>
  );
};
