import React, { useState } from 'react';
import { documentService } from '../services/documentService';
import { UploadCloud, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const DocumentUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedExts = ['pdf', 'docx', 'pptx', 'txt'];
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedExts.includes(ext)) {
        setError('Unsupported file type. Please upload a PDF, DOCX, PPTX, or TXT file.');
        setSelectedFile(null);
        return;
      }
      setError('');
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);
    setError('');

    try {
      const res = await documentService.uploadDocument(selectedFile, (percent) => {
        setProgress(percent);
      });

      if (res.success) {
        setSelectedFile(null);
        setUploading(false);
        onClose();
        if (onUploadSuccess) onUploadSuccess(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload document');
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 border border-slate-800/80">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <UploadCloud className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Upload Research Document</h3>
              <p className="text-xs text-slate-400">PDF, DOCX, PPTX, or TXT up to 100MB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dropzone */}
        <div className="border-2 border-dashed border-slate-700/80 hover:border-emerald-500 rounded-3xl p-8 text-center transition duration-300 cursor-pointer bg-slate-900/50 hover:bg-slate-900/80 relative group">
          <input
            type="file"
            accept=".pdf,.docx,.pptx,.txt"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                Click to browse or drag & drop research file
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Supports PDF, Word, PowerPoint & Text files up to 100MB</p>
            </div>
          </div>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 font-bold">
            <div className="flex items-center space-x-2 truncate">
              <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="truncate">{selectedFile.name}</span>
              <span className="text-[10px] opacity-75">({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          </div>
        )}

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-cyan-400 tracking-wider">
              <span>Indexing local vectors...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-md shadow-cyan-500/50"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-500/10 p-3.5 rounded-2xl border border-rose-500/20 font-bold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-6 py-2.5 text-xs font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white rounded-xl shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition active:scale-95 uppercase tracking-wider"
          >
            {uploading ? 'Indexing...' : 'Upload & Start RAG'}
          </button>
        </div>

      </div>
    </div>
  );
};


