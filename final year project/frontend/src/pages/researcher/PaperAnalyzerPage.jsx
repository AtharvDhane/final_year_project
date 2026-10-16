import React, { useState } from 'react';
import { Microscope } from 'lucide-react';
import { AIToolInterface } from '../../components/AIToolInterface';
import { DocumentSelect } from '../../components/DocumentSelect';
import { researcherService } from '../../services/researcherService';

export const PaperAnalyzerPage = () => {
  const [documentId, setDocumentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentId) return alert('Please select a reference document.');
    setLoading(true);
    try {
      const res = await researcherService.analyzePaper({ documentId });
      setResult(res.result);
    } catch (err) {
      alert('Error analyzing paper: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const inputs = (
    <>
      <DocumentSelect value={documentId} onChange={setDocumentId} label="Select Research Paper" />
    </>
  );

  return (
    <AIToolInterface
      icon={Microscope}
      title="Research Paper Analyzer"
      description="Extract objectives, problems, methodologies, and findings automatically."
      inputs={inputs}
      onSubmit={handleSubmit}
      loading={loading}
      result={result}
      buttonText="Analyze Paper"
    />
  );
};
