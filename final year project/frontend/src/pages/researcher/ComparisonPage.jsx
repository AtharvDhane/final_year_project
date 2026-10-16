import React, { useState } from 'react';
import { GitCompare } from 'lucide-react';
import { AIToolInterface } from '../../components/AIToolInterface';
import { DocumentSelect } from '../../components/DocumentSelect';
import { researcherService } from '../../services/researcherService';

export const ComparisonPage = () => {
  const [documentIds, setDocumentIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentIds || documentIds.length < 2) return alert('Please select at least 2 research papers to compare.');
    setLoading(true);
    try {
      const res = await researcherService.comparePapers({ documentIds });
      setResult(res.result);
    } catch (err) {
      alert('Error comparing papers: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const inputs = (
    <>
      <DocumentSelect value={documentIds} onChange={setDocumentIds} multiple={true} label="Select Papers (Select Multiple)" />
    </>
  );

  return (
    <AIToolInterface
      icon={GitCompare}
      title="Research Paper Comparison"
      description="Compare objectives, methodologies, datasets, and findings across multiple papers."
      inputs={inputs}
      onSubmit={handleSubmit}
      loading={loading}
      result={result}
      buttonText="Compare Papers"
    />
  );
};
