import React, { useState, useRef } from 'react';
import { Database, UploadCloud, FileSpreadsheet } from 'lucide-react';
import { AIToolInterface } from '../../components/AIToolInterface';
import { researcherService } from '../../services/researcherService';

export const DataAnalyzerPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please upload a CSV or XLSX dataset.');
    setLoading(true);
    try {
      const res = await researcherService.analyzeData(file);
      // Format the JSON result as Markdown
      let markdownStr = `### Research Dataset Overview\n\n`;
      markdownStr += `- **Total Rows**: ${res.totalRows}\n`;
      markdownStr += `- **Total Columns**: ${res.totalColumns}\n\n`;
      markdownStr += `#### Column Analysis\n\n`;
      res.columns?.forEach(col => {
        markdownStr += `**${col.columnName}** (${col.type})\n`;
        markdownStr += `- Missing Values: ${col.missingValues}\n`;
        if (col.type === 'Numeric') {
          markdownStr += `- Min: ${col.min}, Max: ${col.max}, Mean: ${col.mean}, Median: ${col.median}\n`;
        } else {
          markdownStr += `- Unique Values: ${col.uniqueValuesCount}\n`;
          if (col.topFrequencies) markdownStr += `- Top Freq: ${col.topFrequencies.join(', ')}\n`;
        }
        markdownStr += '\n';
      });

      setResult(markdownStr);
    } catch (err) {
      alert('Error analyzing dataset: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const inputs = (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Dataset File</label>
      <div
        className="border-2 border-dashed border-white/10 hover:border-emerald-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-500/5 transition-all duration-200 group"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-3">
          {file ? <FileSpreadsheet className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
        </div>
        <p className="text-sm font-black text-slate-200 truncate max-w-full px-2">
          {file ? file.name : 'Click to upload CSV / XLSX'}
        </p>
        <p className="text-xs text-slate-600 font-medium mt-1">Supports .csv, .xlsx</p>
        <input type="file" accept=".csv,.xlsx" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      </div>
    </div>
  );

  return (
    <AIToolInterface
      icon={Database}
      title="Research Data Analyzer"
      description="Extract safe, read-only statistical insights from your CSV/XLSX research dataset without modifying original data."
      inputs={inputs}
      onSubmit={handleSubmit}
      loading={loading}
      result={result}
      buttonText="Analyze Dataset"
    />
  );
};
