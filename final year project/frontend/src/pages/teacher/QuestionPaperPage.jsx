import React, { useState } from 'react';
import { FileQuestion } from 'lucide-react';
import { AIToolInterface } from '../../components/AIToolInterface';
import { DocumentSelect } from '../../components/DocumentSelect';
import { teacherService } from '../../services/teacherService';

export const QuestionPaperPage = () => {
  const [documentId, setDocumentId] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionTypes, setQuestionTypes] = useState('MCQs, Short Answer');
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentId) return alert('Please select a reference document.');
    setLoading(true);
    try {
      const res = await teacherService.generateQuestionPaper({
        documentId, subject, difficulty, questionTypes, numberOfQuestions
      });
      setResult(res.result);
    } catch (err) {
      alert('Error generating question paper: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const inputs = (
    <>
      <DocumentSelect value={documentId} onChange={setDocumentId} label="Reference Syllabus/Material" />
      <div className="space-y-1.5">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject / Topic</label>
        <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Photosynthesis" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 text-sm font-bold text-slate-200 outline-none transition placeholder:text-slate-600" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Difficulty</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 text-sm font-bold text-slate-200 outline-none transition">
            <option className="bg-slate-900">Easy</option>
            <option className="bg-slate-900">Medium</option>
            <option className="bg-slate-900">Hard</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Count</label>
          <input type="number" min="1" max="50" required value={numberOfQuestions} onChange={e => setNumberOfQuestions(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 text-sm font-bold text-slate-200 outline-none transition" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Question Types</label>
        <input type="text" required value={questionTypes} onChange={e => setQuestionTypes(e.target.value)} placeholder="e.g. MCQs, True/False, Long Answer" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 text-sm font-bold text-slate-200 outline-none transition placeholder:text-slate-600" />
      </div>
    </>
  );

  return (
    <AIToolInterface
      icon={FileQuestion}
      title="Question Paper Generator"
      description="Create comprehensive tests from your syllabus material."
      inputs={inputs}
      onSubmit={handleSubmit}
      loading={loading}
      result={result}
    />
  );
};
