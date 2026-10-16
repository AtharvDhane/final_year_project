import React, { useState } from 'react';
import { Presentation } from 'lucide-react';
import { AIToolInterface } from '../../components/AIToolInterface';
import { DocumentSelect } from '../../components/DocumentSelect';
import { teacherService } from '../../services/teacherService';

export const TeachingMaterialPage = () => {
  const [documentId, setDocumentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentId) return alert('Please select a reference document.');
    setLoading(true);
    try {
      const res = await teacherService.generateTeachingMaterial({ documentId });
      setResult(res.result);
    } catch (err) {
      alert('Error generating teaching material: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const inputs = (
    <>
      <DocumentSelect value={documentId} onChange={setDocumentId} label="Syllabus / Source Material" />
    </>
  );

  return (
    <AIToolInterface
      icon={Presentation}
      title="Teaching Material Generator"
      description="Instantly create lecture notes, examples, and key points from your syllabus."
      inputs={inputs}
      onSubmit={handleSubmit}
      loading={loading}
      result={result}
    />
  );
};
