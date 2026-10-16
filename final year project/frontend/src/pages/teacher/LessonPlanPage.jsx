import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { AIToolInterface } from '../../components/AIToolInterface';
import { teacherService } from '../../services/teacherService';

export const LessonPlanPage = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await teacherService.generateLessonPlan({ subject, topic, targetClass, duration });
      setResult(res.result);
    } catch (err) {
      alert('Error generating lesson plan: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const inputs = (
    <>
      <div className="space-y-1.5">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject</label>
        <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Science" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 text-sm font-bold text-slate-200 outline-none transition placeholder:text-slate-600" />
      </div>
      <div className="space-y-1.5">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Topic</label>
        <input type="text" required value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. The Solar System" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 text-sm font-bold text-slate-200 outline-none transition placeholder:text-slate-600" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Class/Grade</label>
          <input type="text" required value={targetClass} onChange={e => setTargetClass(e.target.value)} placeholder="e.g. 5th" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 text-sm font-bold text-slate-200 outline-none transition placeholder:text-slate-600" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</label>
          <input type="text" required value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 45 mins" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 text-sm font-bold text-slate-200 outline-none transition placeholder:text-slate-600" />
        </div>
      </div>
    </>
  );

  return (
    <AIToolInterface
      icon={Calendar}
      title="Lesson Plan Generator"
      description="Create a highly detailed teaching flow."
      inputs={inputs}
      onSubmit={handleSubmit}
      loading={loading}
      result={result}
    />
  );
};
