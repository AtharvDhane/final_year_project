import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { AIToolInterface } from '../../components/AIToolInterface';
import { DocumentSelect } from '../../components/DocumentSelect';
import { researcherService } from '../../services/researcherService';

export const LitReviewPage = () => {
  const [documentIds, setDocumentIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentIds || documentIds.length < 2) return alert('Please select at least 2 research papers for a literature review.');
    setLoading(true);
    try {
      const res = await researcherService.literatureReview({ documentIds });
      setResult(res.result);
    } catch (err) {
      alert('Error generating review: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const inputs = (
    <>
      <DocumentSelect value={documentIds} onChange={setDocumentIds} multiple={true} label="Select Papers for Review (Select Multiple)" />
    </>
  );

  return (
    <AIToolInterface
      icon={Layers}
      title="Literature Review Assistant"
      description="Synthesize multiple papers to extract common themes, methodologies, and findings."
      inputs={inputs}
      onSubmit={handleSubmit}
      loading={loading}
      result={result}
      buttonText="Generate Review"
    />
  );
};
