import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { AIToolInterface } from '../../components/AIToolInterface';
import { DocumentSelect } from '../../components/DocumentSelect';
import { teacherService } from '../../services/teacherService';

export const EvaluationPage = () => {
  const [documentId, setDocumentId] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentId) return alert('Please select a reference document.');
    setLoading(true);
    try {
      const res = await teacherService.evaluateAnswer({ documentId, studentAnswer });
      setResult(res.result);
    } catch (err) {
      alert('Error evaluating answer: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const inputs = (
    <>
      <DocumentSelect value={documentId} onChange={setDocumentId} label="Reference Material / Model Answer" />
      <div className="space-y-1.5">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Student's Answer</label>
        <textarea required rows={7} value={studentAnswer} onChange={e => setStudentAnswer(e.target.value)} placeholder="Paste the student's answer here..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 text-sm font-bold text-slate-200 outline-none transition resize-none placeholder:text-slate-600"></textarea>
      </div>
    </>
  );

  return (
    <AIToolInterface
      icon={CheckCircle}
      title="Automatic Evaluation & Feedback"
      description="Evaluate student answers against your reference material."
      inputs={inputs}
      onSubmit={handleSubmit}
      loading={loading}
      result={result}
    />
  );
};
