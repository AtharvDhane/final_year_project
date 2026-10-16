import React, { useState } from 'react';
import { Quote } from 'lucide-react';
import { AIToolInterface } from '../../components/AIToolInterface';
import { DocumentSelect } from '../../components/DocumentSelect';
import { researcherService } from '../../services/researcherService';

export const CitationPage = () => {
  const [documentId, setDocumentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentId) return alert('Please select a reference document.');
    setLoading(true);
    try {
      const res = await researcherService.generateCitations({ documentId });
      setResult(res.result);
    } catch (err) {
      alert('Error generating citations: ' + (err.response?.data?.message || err.message));
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
      icon={Quote}
      title="Citation & Reference Assistant"
      description="Automatically generate APA, MLA, and IEEE citations from your uploaded paper without fabricating missing info."
      inputs={inputs}
      onSubmit={handleSubmit}
      loading={loading}
      result={result}
      buttonText="Generate Citations"
    />
  );
};
