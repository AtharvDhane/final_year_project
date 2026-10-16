import React, { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import { FileText, Loader2 } from 'lucide-react';

/* Dark-theme styled document selector */
export const DocumentSelect = ({
  value,
  onChange,
  label = 'Select Reference Material',
  multiple = false,
}) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await documentService.getDocuments();
        if (res.success) {
          setDocuments(res.data);
          if (res.data.length > 0 && (!value || value.length === 0)) {
            onChange(multiple ? [res.data[0].id] : res.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load docs:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [onChange, value, multiple]);

  const handleChange = (e) => {
    if (multiple) {
      onChange(Array.from(e.target.selectedOptions, (o) => o.value));
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-400/60 pointer-events-none" />
        <select
          multiple={multiple}
          value={value}
          onChange={handleChange}
          disabled={loading}
          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 text-sm font-bold text-slate-200 outline-none transition disabled:opacity-50 ${
            multiple ? 'min-h-[110px]' : 'appearance-none'
          }`}
        >
          {loading ? (
            <option>Loading documents...</option>
          ) : documents.length === 0 ? (
            <option value="">No documents — upload one first</option>
          ) : (
            documents.map((doc) => (
              <option key={doc.id} value={doc.id} className="bg-slate-900">
                {doc.fileName}
              </option>
            ))
          )}
        </select>
        {!multiple && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 text-slate-500 animate-spin" />
            ) : (
              <span className="text-slate-500 text-xs">▼</span>
            )}
          </div>
        )}
      </div>
      {multiple && (
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Hold Ctrl/Cmd to select multiple</p>
      )}
    </div>
  );
};
