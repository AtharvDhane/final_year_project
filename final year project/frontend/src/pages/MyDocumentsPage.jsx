import React, { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DocumentUploadModal } from '../components/DocumentUploadModal';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Trash2,
  Eye,
  MessageSquare,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Grid,
  List,
  HardDrive
} from 'lucide-react';

export const MyDocumentsPage = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentService.getDocuments();
      if (res.success && res.data) {
        setDocuments(res.data);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await documentService.deleteDocument(id);
      if (res.success) {
        setDocuments(documents.filter((d) => d.id !== id));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete document');
    }
  };

  // Filter documents by format and search term
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = selectedFormat === 'ALL' || doc.fileType.toUpperCase() === selectedFormat;
    return matchesSearch && matchesFormat;
  });

  const getFormatBadgeColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'DOCX':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'PPTX':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col">
      <Navbar onOpenUploadModal={() => setIsUploadOpen(true)} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Axiom Library</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                Manage, preview, and chat with all your uploaded research papers up to 100MB.
              </p>
            </div>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>

          {/* Search, Filter & Layout Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-3xl">
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search documents by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl text-xs font-medium outline-none focus:border-emerald-500 transition shadow-inner"
              />
            </div>

            {/* Format Filter Pills & Grid Toggle */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex space-x-1.5 bg-slate-100 dark:bg-slate-900/40 backdrop-blur-2xl p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                {['ALL', 'PDF', 'DOCX', 'PPTX', 'TXT'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-300 ${
                      selectedFormat === fmt
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                        : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <div className="flex space-x-1 border-l border-slate-200 dark:border-slate-800 pl-3">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-xl text-xs ${viewMode === 'grid' ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20' : 'text-slate-400'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-xl text-xs ${viewMode === 'list' ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20' : 'text-slate-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Document Content View */}
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <Sparkles className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-xs font-bold">Loading research library...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center glass-panel">
              <HardDrive className="w-12 h-12 text-slate-400" />
              <h3 className="font-bold text-base text-slate-700 dark:text-slate-300">No Documents Found</h3>
              <p className="text-xs text-slate-400 max-w-md">
                {searchQuery || selectedFormat !== 'ALL'
                  ? 'No documents match your current filter criteria.'
                  : 'Upload your research papers, notes, or PDFs to start asking questions with AI.'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-panel rounded-3xl p-6 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-xl border ${getFormatBadgeColor(doc.fileType)}`}>
                        {doc.fileType}
                      </span>
                      <span className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>INDEXED</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug" title={doc.fileName}>
                      {doc.fileName}
                    </h3>

                    <p className="text-xs text-slate-400 flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Uploaded {new Date(doc.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/chat?documentId=${doc.id}`)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Launch RAG Chat</span>
                    </button>

                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="glass-panel rounded-3xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Document Title</th>
                    <th className="p-4">Format</th>
                    <th className="p-4">Uploaded Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-500/5 transition">
                      <td className="p-4 font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-emerald-500" />
                        <span>{doc.fileName}</span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-xl border ${getFormatBadgeColor(doc.fileType)}`}>
                          {doc.fileType}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-400">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => navigate(`/chat?documentId=${doc.id}`)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
                        >
                          Launch RAG Chat
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>

      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={loadDocuments}
      />
    </div>
  );
};



