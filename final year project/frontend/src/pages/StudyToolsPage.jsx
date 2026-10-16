import React, { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import { aiToolsService } from '../services/aiToolsService';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import {
  Brain,
  FileText,
  Sparkles,
  HelpCircle,
  Layers,
  Globe,
  Smile,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCw,
  Copy,
  Check,
  GitBranch,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });

const MermaidRenderer = ({ chart }) => {
  const [svg, setSvg] = useState('');
  
  useEffect(() => {
    if (chart) {
      const renderChart = async () => {
        try {
          const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
          let cleanChart = typeof chart === 'string' ? chart.trim() : '';
          if (cleanChart.startsWith('```mermaid')) {
             cleanChart = cleanChart.replace(/^```mermaid\n/, '').replace(/\n```$/, '');
          } else if (cleanChart.startsWith('```')) {
             cleanChart = cleanChart.replace(/^```\n/, '').replace(/\n```$/, '');
          }
          const { svg } = await mermaid.render(id, cleanChart);
          setSvg(svg);
        } catch (error) {
          console.error('Mermaid rendering error', error);
          setSvg(`<p class="text-rose-500 text-center font-semibold">Mind map is too complex or invalid to render.</p>`);
        }
      };
      renderChart();
    }
  }, [chart]);

  return <div dangerouslySetInnerHTML={{ __html: svg }} className="w-full overflow-auto flex justify-center py-4" />;
};

export const StudyToolsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Translation language
  const [targetLang, setTargetLang] = useState('Spanish');

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    if (selectedDocId) {
      handleGenerateTool(activeTab, selectedDocId, targetLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocId]);

  useEffect(() => {
    if (activeTab === 'translate' && selectedDocId) {
      handleGenerateTool('translate', selectedDocId, targetLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLang]);

  const loadDocuments = async () => {
    try {
      const res = await documentService.getDocuments();
      if (res.success && res.data?.length > 0) {
        setDocuments(res.data);
        setSelectedDocId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateTool = async (tab, docId = selectedDocId, lang = targetLang) => {
    if (!docId) return;
    setActiveTab(tab);
    setLoading(true);
    setError('');
    setResultData(null);
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    setCardIndex(0);
    setIsFlipped(false);

    try {
      let res;
      switch (tab) {
        case 'summary':
          res = await aiToolsService.generateSummary(docId);
          break;
        case 'notes':
          res = await aiToolsService.generateNotes(docId);
          break;
        case 'quiz':
          res = await aiToolsService.generateQuiz(docId);
          break;
        case 'flashcards':
          res = await aiToolsService.generateFlashcards(docId);
          break;
        case 'mindmap':
          res = await aiToolsService.generateMindMap(docId);
          break;
        case 'eli5':
          res = await aiToolsService.generateEli5(docId);
          break;
        case 'translate':
          res = await aiToolsService.translateDocument(docId, lang);
          break;
        default:
          break;
      }
      if (res && res.success) {
        setResultData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate study tool response');
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-Speech is not supported in your browser.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center space-x-3">
                <Brain className="w-8 h-8 text-blue-500" />
                <span>AI Study & Learning Suite</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Generate summaries, study notes, practice MCQs, active recall flashcards, and translations.
              </p>
            </div>

            {/* Source Document & Language Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              {/* Language Selector for Translation */}
              {activeTab === 'translate' && (
                <div className="w-full sm:w-48">
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Target Language</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Japanese">Japanese (日本語)</option>
                    <option value="Chinese">Chinese (中文)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                    <option value="Russian">Russian (Русский)</option>
                    <option value="Portuguese">Portuguese (Português)</option>
                    <option value="Bengali">Bengali (বাংলা)</option>
                    <option value="Marathi">Marathi (मराठी)</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                    <option value="Urdu">Urdu (اردو)</option>
                  </select>
                </div>
              )}

              {/* Source Document Selector */}
              <div className="w-full sm:w-72">
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Source Document</label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.fileName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tools Navigation Tabs */}
          <div className="flex space-x-2.5 border-b border-slate-200/80 dark:border-slate-800/80 overflow-x-auto pb-3">
            {[
              { id: 'summary', name: 'Executive Summary', icon: Sparkles },
              { id: 'notes', name: 'Chapter & Topic Notes', icon: FileText },
              { id: 'quiz', name: '20 MCQ Practice Quiz', icon: HelpCircle },
              { id: 'flashcards', name: 'Flashcards Deck', icon: Layers },
              { id: 'mindmap', name: 'Mind Map', icon: GitBranch },
              { id: 'eli5', name: 'ELI5 Explanation', icon: Smile },
              { id: 'translate', name: 'Language Translation', icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleGenerateTool(tab.id)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-xs tracking-wide transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                      : 'glass-panel text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-cyan-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tool Content Area */}
          <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[400px]">
            
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-400">
                <Brain className="w-10 h-10 text-blue-500 animate-bounce" />
                <p className="text-sm font-semibold">Groq Llama 3.3 70B is generating your study tool...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm">
                {error}
              </div>
            ) : !resultData ? (
              <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Sparkles className="w-10 h-10 text-slate-400" />
                <p className="text-sm font-semibold">Select a document above and click a tab to generate AI study artifacts.</p>
              </div>
            ) : (
              <div>
                
                {/* Summary / ELI5 / Translation Output */}
                {(activeTab === 'summary' || activeTab === 'eli5' || activeTab === 'translate' || activeTab === 'mindmap') && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="font-bold text-lg capitalize">{activeTab} Output</h3>
                        {activeTab === 'translate' && (
                          <span className="text-xs text-blue-500 font-semibold">Translated to {targetLang}</span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleTextToSpeech(typeof resultData === 'string' ? resultData : JSON.stringify(resultData))}
                          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Read Aloud (TTS)"
                        >
                          <Volume2 className="w-5 h-5 text-blue-500" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(typeof resultData === 'string' ? resultData : JSON.stringify(resultData))}
                          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed bg-transparent p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                      {activeTab === 'mindmap' ? (
                        <MermaidRenderer chart={typeof resultData === 'string' ? resultData : ''} />
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {typeof resultData === 'string' ? resultData : JSON.stringify(resultData, null, 2)}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                )}

                {/* Chapter & Topic Notes Output */}
                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                      <h3 className="font-bold text-lg">{resultData.title}</h3>
                      <button
                        onClick={() => copyToClipboard(resultData.contentMarkdown)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center space-x-1"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        <span>Copy Markdown Notes</span>
                      </button>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed bg-transparent p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{resultData.contentMarkdown}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* 20 MCQ Interactive Quiz Runner */}
                {activeTab === 'quiz' && resultData.questions && (
                  <div className="space-y-6 max-w-3xl mx-auto">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="font-bold text-lg">{resultData.title}</h3>
                        <p className="text-xs text-slate-400">Complete all questions and click submit to test your comprehension.</p>
                      </div>
                      <span className="text-xs font-extrabold px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full">
                        {resultData.questions.length} MCQs
                      </span>
                    </div>

                    {/* Quiz Score Summary Banner */}
                    {submittedQuiz && (
                      <div className="p-5 bg-gradient-to-r from-blue-600/10 to-teal-600/10 border border-blue-500/30 rounded-2xl flex justify-between items-center">
                        <div>
                          <h4 className="font-extrabold text-base text-blue-600 dark:text-blue-400">Quiz Results Submitted!</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            You scored {Object.keys(selectedAnswers).filter((qIdx) => selectedAnswers[qIdx] === resultData.questions[qIdx].correctAnswerIndex).length} out of {resultData.questions.length} questions correctly.
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                            {Math.round((Object.keys(selectedAnswers).filter((qIdx) => selectedAnswers[qIdx] === resultData.questions[qIdx].correctAnswerIndex).length / resultData.questions.length) * 100)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {resultData.questions.map((q, idx) => (
                      <div key={idx} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                        <p className="font-semibold text-sm">
                          {idx + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-1 gap-2 pt-1">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedAnswers[idx] === oIdx;
                            const isCorrect = q.correctAnswerIndex === oIdx;
                            let btnStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800';

                            if (submittedQuiz) {
                              if (isCorrect) btnStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold';
                              else if (isSelected) btnStyle = 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400';
                            } else if (isSelected) {
                              btnStyle = 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold';
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={submittedQuiz}
                                onClick={() => setSelectedAnswers((prev) => ({ ...prev, [idx]: oIdx }))}
                                className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs transition ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {submittedQuiz && (
                          <div className="text-xs p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setSubmittedQuiz(true)}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition"
                      >
                        Submit & View Score
                      </button>
                    </div>
                  </div>
                )}

                {/* 3D Active Recall Flashcards Deck */}
                {activeTab === 'flashcards' && resultData.cards && (
                  <div className="max-w-xl mx-auto space-y-6 text-center py-6">
                    <p className="text-xs text-slate-400">Card {cardIndex + 1} of {resultData.cards.length}</p>

                    <div
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="min-h-[220px] p-8 border-2 border-blue-500/30 rounded-3xl bg-gradient-to-tr from-blue-900/10 to-teal-900/10 dark:bg-slate-800/80 flex flex-col items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition duration-300"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-2">
                        {isFlipped ? 'Answer (Back)' : 'Question (Front)'}
                      </span>
                      <p className="text-lg font-bold">
                        {isFlipped ? resultData.cards[cardIndex].back : resultData.cards[cardIndex].front}
                      </p>
                      <span className="text-[11px] text-slate-400 mt-4">(Click to Flip)</span>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        disabled={cardIndex === 0}
                        onClick={() => {
                          setCardIndex((prev) => prev - 1);
                          setIsFlipped(false);
                        }}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-xs font-semibold rounded-xl disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        disabled={cardIndex === resultData.cards.length - 1}
                        onClick={() => {
                          setCardIndex((prev) => prev + 1);
                          setIsFlipped(false);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl disabled:opacity-50"
                      >
                        Next Card
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
};



