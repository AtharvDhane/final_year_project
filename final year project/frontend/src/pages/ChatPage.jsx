import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { documentService } from '../services/documentService';
import { chatService } from '../services/chatService';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import {
  Send,
  Sparkles,
  FileText,
  BookOpen,
  Bot,
  User,
  ExternalLink,
  ChevronDown,
  Brain,
  HelpCircle,
  Layers,
  Copy,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const ChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDocId = searchParams.get('documentId');

  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(initialDocId || '');
  const [activeDoc, setActiveDoc] = useState(null);
  const [docBlobUrl, setDocBlobUrl] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    if (selectedDocId) {
      // Load doc details first, then chat history with the doc name
      loadDocAndChat(selectedDocId);
    }
  }, [selectedDocId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingAnswer]);

  const handleClearChat = () => {
    setMessages([{
      sender: 'AI',
      content: 'Chat history cleared. How can I help you next?',
      citations: [],
    }]);
    setSessionId(null);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleRegenerate = async () => {
    // Find the last user message
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'USER');
    if (lastUserMsg) {
      // Remove the last AI message if it exists
      const newMessages = [...messages];
      if (newMessages[newMessages.length - 1].sender === 'AI') {
        newMessages.pop();
      }
      setMessages(newMessages);
      handleSendMessage(null, lastUserMsg.content);
    }
  };

  const loadDocuments = async () => {
    try {
      const res = await documentService.getDocuments();
      if (res.success && res.data?.length > 0) {
        setDocuments(res.data);
        if (!selectedDocId) {
          setSelectedDocId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadDocAndChat = async (docId) => {
    let docName = 'your document';
    try {
      const res = await documentService.getDocumentById(docId);
      if (res.success) {
        setActiveDoc(res.data);
        docName = res.data.fileName;
        // Load blob URL for authenticated file preview
        if (res.data.fileType === 'PDF' || res.data.fileType === 'TXT') {
          try {
            const blobUrl = await documentService.getDocumentFileBlob(docId);
            setDocBlobUrl(blobUrl);
          } catch (blobErr) {
            console.error('Failed to load document preview:', blobErr);
            setDocBlobUrl(null);
          }
        } else {
          setDocBlobUrl(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
    await loadChatHistory(docId, docName);
  };

  const loadChatHistory = async (docId, docName) => {
    try {
      const res = await chatService.getChatSessions(docId);
      if (res.success && res.data?.length > 0) {
        const latestSession = res.data[0];
        setSessionId(latestSession.id);
        setMessages(latestSession.messages || []);
      } else {
        setSessionId(null);
        setMessages([
          {
            sender: 'AI',
            content: `Hello! I am your AI Research Assistant. I have indexed **${docName}**. Ask me anything!`,
            citations: [],
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e, customText = null) => {
    if (e) e.preventDefault();
    const query = customText || inputMessage;
    if (!query.trim() || !selectedDocId || loadingAnswer) return;

    const userMsg = { sender: 'USER', content: query, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoadingAnswer(true);

    try {
      const res = await chatService.askQuestion(selectedDocId, sessionId, query);
      if (res.success && res.data) {
        setSessionId(res.data.sessionId);
        const aiMsg = {
          sender: 'AI',
          content: res.data.aiAnswer,
          citations: res.data.citations || [],
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (res.data.suggestedQuestions) {
          setSuggestedQuestions(res.data.suggestedQuestions);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'AI',
          content: 'Sorry, an error occurred while generating the answer: ' + err.message,
          citations: [],
        },
      ]);
    } finally {
      setLoadingAnswer(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* NotebookLM Split Screen Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Panel: Document Viewer / Selection */}
          <div className="w-full md:w-1/2 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900/50">
            
            {/* Header: Document Switcher */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1 mr-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <select
                  value={selectedDocId}
                  onChange={(e) => {
                    setSelectedDocId(e.target.value);
                    setSearchParams({ documentId: e.target.value });
                  }}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none"
                >
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.fileName} ({doc.fileType})
                    </option>
                  ))}
                </select>
              </div>

              {activeDoc && (
                <button
                  onClick={async () => {
                    try {
                      const blobUrl = await documentService.getDocumentFileBlob(activeDoc.id);
                      window.open(blobUrl, '_blank');
                    } catch (err) {
                      console.error('Failed to open document:', err);
                    }
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-blue-500 transition"
                  title="Open Original Document in New Tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Document Viewer Frame */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeDoc ? (
                activeDoc.fileType === 'PDF' || activeDoc.fileType === 'TXT' ? (
                  <iframe
                    src={docBlobUrl}
                    className="w-full h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 backdrop-blur-2xl"
                    title="PDF Viewer"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <BookOpen className="w-12 h-12 text-blue-500 mb-3" />
                    <h3 className="font-bold text-lg">{activeDoc.fileName}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Format: {activeDoc.fileType} • {activeDoc.chunkCount} Vector Chunks Indexed in Qdrant
                    </p>
                  </div>
                )
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">Select a document</div>
              )}
            </div>

          </div>

          {/* Right Panel: Interactive RAG Chat */}
          <div className="w-full md:w-1/2 flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
            
            {/* Chat Header Tools */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-2">Active Session</span>
              <button 
                onClick={handleClearChat}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold transition"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex space-x-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'AI' && (
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-emerald-500/20">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                  )}

                  <div
                    className={`group max-w-[88%] rounded-3xl p-5 space-y-3 text-xs leading-relaxed shadow-xl ${
                      msg.sender === 'USER'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-br-none shadow-emerald-500/20'
                        : 'glass-panel text-slate-800 dark:text-slate-100 rounded-bl-none border-slate-200/80 dark:border-slate-800/80'
                    }`}
                  >
                    <div className="prose dark:prose-invert prose-xs max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>

                    {/* Citations List */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                          Source Document Citations:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((cit, cIdx) => (
                            <span
                              key={cIdx}
                              title={cit.textSnippet}
                              className="inline-flex items-center px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 text-[10px] font-black border border-cyan-500/20 cursor-help hover:bg-cyan-500/20 transition"
                            >
                              Page {cit.pageNumber}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Message Action Bar */}
                    {msg.sender === 'AI' && (
                      <div className="pt-2 flex items-center justify-end space-x-2 border-t border-transparent group-hover:border-slate-200/20 transition-all opacity-40 hover:opacity-100">
                        <button 
                          onClick={() => handleCopy(msg.content)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-500 transition"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {index === messages.length - 1 && (
                          <button 
                            onClick={handleRegenerate}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-500 transition"
                            title="Regenerate answer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {msg.sender === 'USER' && (
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-slate-950 font-black text-xs flex-shrink-0 shadow-md">
                      U
                    </div>
                  )}
                </div>
              ))}

              {loadingAnswer && (
                <div className="flex space-x-3 items-center text-cyan-400 text-xs font-bold animate-pulse p-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <span>Scanning local vector embeddings & generating response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Follow-up Questions */}
            {suggestedQuestions.length > 0 && (
              <div className="px-4 py-2.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md flex space-x-2 overflow-x-auto">
                {suggestedQuestions.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={(e) => handleSendMessage(e, q)}
                    className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold whitespace-nowrap hover:bg-emerald-500/20 transition flex-shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask any research question about your document..."
                  disabled={loadingAnswer || !selectedDocId}
                  className="w-full pl-5 pr-14 py-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 text-xs font-medium focus:border-emerald-500 outline-none transition shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || loadingAnswer || !selectedDocId}
                  className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white disabled:opacity-40 transition shadow-lg shadow-emerald-500/25 active:scale-95"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
};



