import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { AIToolInterface } from '../../components/AIToolInterface';
import { DocumentSelect } from '../../components/DocumentSelect';
import { teacherService } from '../../services/teacherService';

export const AssignmentPage = () => {
  const [documentId, setDocumentId] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentId) return alert('Please select a reference document.');
    setLoading(true);
    try {
      const res = await teacherService.generateAssignment({ documentId, topic });
      setResult(res.result);
    } catch (err) {
      alert('Error generating assignment: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const inputs = (
    <>
      <DocumentSelect value={documentId} onChange={setDocumentId} label="Reference Material" />
      <div className="space-y-1.5">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignment Topic</label>
        <input type="text" required value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. World War II Causes" className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 text-sm font-bold text-slate-800 dark:text-white outline-none transition" />
      </div>
    </>
  );

  return (
    <AIToolInterface
      icon={BookOpen}
      title="Assignment Generator"
      description="Instantly generate structured student assignments."
      inputs={inputs}
      onSubmit={handleSubmit}
      loading={loading}
      result={result}
    />
  );
};
