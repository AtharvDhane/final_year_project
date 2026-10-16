import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { AIToolInterface } from '../../components/AIToolInterface';
import { DocumentSelect } from '../../components/DocumentSelect';
import { researcherService } from '../../services/researcherService';

export const GapFinderPage = () => {
  const [documentIds, setDocumentIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentIds || documentIds.length < 1) return alert('Please select at least 1 research paper.');
    setLoading(true);
    try {
      const res = await researcherService.findResearchGaps({ documentIds });
      setResult(res.result);
    } catch (err) {
      alert('Error finding gaps: ' + (err.response?.data?.message || err.message));
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
      icon={Target}
      title="Research Gap Finder"
      description="Identify methodological, dataset, and geographical gaps from existing literature."
      inputs={inputs}
      onSubmit={handleSubmit}
      loading={loading}
      result={result}
      buttonText="Find Gaps"
    />
  );
};
