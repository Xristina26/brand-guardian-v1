import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import JSZip from 'jszip';
import { 
  ShieldCheck, 
  FileText, 
  Layout, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Loader2,
  BookOpen,
  ArrowRight,
  Info,
  ShieldAlert,
  History,
  Library,
  Save,
  Download,
  ScrollText,
  Upload,
  Trash2,
  ExternalLink,
  Plus,
  ArrowLeft,
  Search,
  Menu,
  X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import { reviewContent } from './lib/gemini';

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface ReviewResult {
  id: string;
  timestamp: string;
  assetType: string;
  raw: string;
  compliance?: 'Compliant' | 'Non-compliant';
  severity?: 'None' | 'Minor' | 'Moderate' | 'Critical';
  confidence?: string;
  recommendedAction?: string;
}

interface SavedGuideline {
  id: string;
  name: string;
  text: string;
  department?: string;
  lastUsed: string;
}

type View = 'workspace' | 'library' | 'history';

const LandingPage = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <nav className="relative z-10 px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-xl italic tracking-tighter">B</div>
          <span className="font-display font-bold text-2xl tracking-tight">Brand Guardian</span>
        </div>
        <button 
          onClick={onStart}
          className="hidden md:flex bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-full text-sm font-semibold transition-all backdrop-blur-md"
        >
          Launch Engine
        </button>
      </nav>

      <main className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Universal Audit Engine</span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl font-black leading-[0.9] text-white mb-8 tracking-tighter">
              BRAND <br />
              <span className="text-white/40">GUARDIAN</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-lg mb-10 leading-relaxed font-light">
              One central tool for all teams/departments. Never again will your teams ask where the brand guidelines are—get a definitive <span className="text-emerald-400 font-semibold italic">Yes/No</span> on compliance instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onStart}
                className="group relative bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-indigo-500/20 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest text-xs">
                  Launch Audit Engine <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
              <div className="flex items-center gap-4 px-4">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Trusted by 200+ brands</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/40" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-mono text-slate-500 uppercase">Live Engine Status</div>
              </div>
              <div className="space-y-6">
                {[
                  { label: 'Tone of Voice', status: 'Approved', color: 'bg-emerald-500' },
                  { label: 'Visual Identity', status: '100%', color: 'bg-indigo-500' },
                  { label: 'Legal & Compliance', status: 'Verified', color: 'bg-indigo-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span>{item.label}</span>
                      <span>{item.status}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: idx === 0 ? '100%' : '100%' }}
                        transition={{ duration: 1.5, delay: 1 + (idx * 0.2) }}
                        className={`h-full ${item.color}`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                     <CheckCircle2 size={24} className="text-emerald-500" />
                   </div>
                   <div>
                     <p className="text-xs font-bold uppercase">GO FOR LAUNCH</p>
                     <p className="text-[10px] text-slate-500 tracking-widest uppercase">Compliance Score: 10/10</p>
                   </div>
                 </div>
                 <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                    <ShieldCheck size={16} className="text-indigo-400" />
                 </div>
              </div>
            </div>
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">© 2026 Brand Guardian Engine.</p>
          <div className="flex gap-4 sm:gap-8">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">For all organisations/businesses cross-sector</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  // Navigation State
  const [appStarted, setAppStarted] = useState(false);
  const [currentView, setCurrentView] = useState<View>('workspace');
  const [guidelines, setGuidelines] = useState('');
  const [content, setContent] = useState('');
  const [assetType, setAssetType] = useState('social post');
  const [department, setDepartment] = useState('');
  const [audienceLocation, setAudienceLocation] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Persistence State
  const [savedGuidelines, setSavedGuidelines] = useState<SavedGuideline[]>([]);
  const [reviewHistory, setReviewHistory] = useState<ReviewResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from LocalStorage
  useEffect(() => {
    const storedGuidelines = localStorage.getItem('bg_guidelines');
    const storedHistory = localStorage.getItem('bg_history');
    if (storedGuidelines) setSavedGuidelines(JSON.parse(storedGuidelines));
    if (storedHistory) setReviewHistory(JSON.parse(storedHistory));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('bg_guidelines', JSON.stringify(savedGuidelines));
  }, [savedGuidelines]);

  useEffect(() => {
    localStorage.setItem('bg_history', JSON.stringify(reviewHistory));
  }, [reviewHistory]);

  const parseResult = (text: string): Partial<ReviewResult> => {
    const complianceMatch = text.match(/COMPLIANCE:\s*(.*)/i);
    const severityMatch = text.match(/SEVERITY:\s*(.*)/i);
    const confidenceMatch = text.match(/CONFIDENCE:\s*(.*)/i);
    const actionMatch = text.match(/RECOMMENDED ACTION:\s*(.*)/i);

    return {
      compliance: complianceMatch?.[1].trim() as any,
      severity: severityMatch?.[1].trim() as any,
      confidence: confidenceMatch?.[1].trim(),
      recommendedAction: actionMatch?.[1].trim(),
    };
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidelines || !content) {
      setError('Please provide both guidelines and content to review.');
      return;
    }

    setIsReviewing(true);
    setError(null);
    
    // Initial placeholder for streaming
    const initialResult: ReviewResult = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      assetType,
      raw: '',
    };
    setResult(initialResult);

    try {
      const responseText = await reviewContent(
        guidelines, 
        content, 
        assetType, 
        department, 
        audienceLocation,
        (currentText) => {
          setResult(prev => prev ? { ...prev, raw: currentText, ...parseResult(currentText) } : null);
        }
      );
      
      const finalParsed = parseResult(responseText);
      const finalReview: ReviewResult = {
        ...initialResult,
        raw: responseText,
        ...finalParsed
      };
      
      setResult(finalReview);
      setReviewHistory(prev => [finalReview, ...prev]);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setResult(null);
    } finally {
      setIsReviewing(false);
    }
  };

  const saveCurrentGuidelines = () => {
    if (!guidelines.trim()) return;
    const name = prompt('Enter a name for these guidelines:');
    if (!name) return;

    const newGuideline: SavedGuideline = {
      id: crypto.randomUUID(),
      name,
      text: guidelines,
      department,
      lastUsed: new Date().toISOString()
    };
    setSavedGuidelines(prev => [newGuideline, ...prev]);
    setCurrentView('library');
  };

  const deleteGuideline = (id: string) => {
    if (confirm('Are you sure you want to delete this guideline?')) {
      setSavedGuidelines(prev => prev.filter(g => g.id !== id));
    }
  };

  const deleteReview = (id: string) => {
    if (confirm('Are you sure you want to delete this review from history?')) {
      setReviewHistory(prev => prev.filter(r => r.id !== id));
    }
  };

  const useGuideline = (g: SavedGuideline) => {
    setGuidelines(g.text);
    setDepartment(g.department || '');
    setCurrentView('workspace');
    setSavedGuidelines(prev => prev.map(item => item.id === g.id ? { ...item, lastUsed: new Date().toISOString() } : item));
  };

  // File Upload Helpers
  const extractTextFromPdf = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const extractTextFromPptx = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    let fullText = '';
    const slideFiles = Object.keys(zip.files).filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'));
    
    slideFiles.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

    for (const slidePath of slideFiles) {
      const content = await zip.file(slidePath)?.async('string');
      if (content) {
        const matches = content.match(/<a:t>([^<]+)<\/a:t>/g);
        if (matches) {
          const slideText = matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
          fullText += `${slideText}\n`;
        }
      }
    }
    return fullText;
  };

  const onDrop = useCallback(async (acceptedFiles: File[], target: 'guidelines' | 'content') => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessingFile(true); // Show specific file processing feedback
    try {
      let text = '';
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.name.endsWith('.pdf')) {
        text = await extractTextFromPdf(file);
      } else if (file.name.endsWith('.pptx')) {
        text = await extractTextFromPptx(file);
      } else if (file.name.endsWith('.txt')) {
        text = await file.text();
      } else {
        setError(`Unsupported file type: ${file.name}. Please use .docx, .pdf, .pptx, or .txt`);
        setIsReviewing(false);
        return;
      }

      if (target === 'guidelines') setGuidelines(text);
      if (target === 'content') setContent(text);
      setError(null);
    } catch (err) {
      console.error('File reading error:', err);
      setError('Could not read the file. Please ensure it is a valid document.');
    } finally {
      setIsProcessingFile(false);
    }
  }, []);

  const DropZone = ({ target, label }: { target: 'guidelines' | 'content', label: string }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => onDrop(files, target),
      accept: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
        'text/plain': ['.txt']
      },
      multiple: false
    });

    return (
      <div 
        {...getRootProps()} 
        className={`mt-1 border-2 border-dashed rounded-lg p-3 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={14} className="text-slate-400" />
        <p className="text-[10px] text-slate-500 text-center">
          {isDragActive ? 'Drop file here' : `Upload ${label} (.pdf, .pptx, .docx, .txt)`}
        </p>
      </div>
    );
  };

  if (!appStarted) {
    return <LandingPage onStart={() => setAppStarted(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <nav className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col shrink-0 z-50 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:block ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg italic tracking-tighter">B</div>
            <span className="font-semibold tracking-tight text-lg">Brand Guardian</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 p-4 space-y-1 mt-2">
          <button 
            onClick={() => { setCurrentView('workspace'); setIsSidebarOpen(false); }}
            className={`w-full text-left p-3 rounded-lg text-sm flex items-center gap-3 transition-all ${
              currentView === 'workspace' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
            }`}
          >
            <FileText size={18} className="opacity-70" />
            Review Workspace
          </button>
          <button 
            onClick={() => { setCurrentView('library'); setIsSidebarOpen(false); }}
            className={`w-full text-left p-3 rounded-lg text-sm flex items-center gap-3 transition-all ${
              currentView === 'library' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
            }`}
          >
            <Library size={18} className="opacity-70" />
            Guidelines Library
          </button>
          <button 
            onClick={() => { setCurrentView('history'); setIsSidebarOpen(false); }}
            className={`w-full text-left p-3 rounded-lg text-sm flex items-center gap-3 transition-all ${
              currentView === 'history' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
            }`}
          >
            <History size={18} className="opacity-70" />
            Review History
          </button>
        </div>
        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center text-[10px] uppercase font-bold text-slate-300">
              BG
            </div>
            <div className="text-xs">
              <p className="font-medium text-slate-200">User Session</p>
              <p className="text-slate-500">Brand Analyst</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Workspace View */}
        {currentView === 'workspace' && (
          <>
            <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 lg:gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  <Menu size={20} />
                </button>
                <h2 className="text-sm lg:text-lg font-semibold text-slate-700 truncate max-w-[120px] sm:max-w-none">Active Review</h2>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                  {result ? 'Analysis Ready' : 'Editor Workspace'}
                </span>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                <button 
                  onClick={saveCurrentGuidelines}
                  className="p-2 lg:px-4 lg:py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-2"
                  title="Save Guidelines"
                >
                  <Save size={16} /><span className="hidden lg:inline">Save Guidelines</span>
                </button>
                <button 
                  onClick={() => window.print()}
                  disabled={!result}
                  className="p-2 lg:px-4 lg:py-2 text-sm font-medium bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  title="Export Report"
                >
                   <Download size={16} /><span className="hidden lg:inline">Export Report</span>
                </button>
              </div>
            </header>

            <div className="flex-1 p-4 lg:p-8 grid grid-cols-12 gap-8 overflow-y-auto">
              {/* Left Column */}
              <section className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-fit">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-6"
                >
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info size={12} /> Parameters & Assets
                  </h3>
                  
                  <form onSubmit={handleReview} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Asset Type</label>
                        <select
                          value={assetType}
                          onChange={(e) => setAssetType(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="social post">LinkedIn / Social Post</option>
                          <option value="email">Email Marketing / CRM</option>
                          <option value="landing page">Landing Page / Web Copy</option>
                          <option value="ad copy">Search / Display Ad Copy</option>
                          <option value="press release">Press Release / News</option>
                          <option value="whitepaper">Whitepaper / Case Study</option>
                          <option value="video script">Video Script / Storyboard</option>
                          <option value="internal">Internal Announcement</option>
                        </select>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Audience Location</label>
                        <input
                          type="text"
                          value={audienceLocation}
                          onChange={(e) => setAudienceLocation(e.target.value)}
                          placeholder="e.g. UK, USA, Global"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Department / Team</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Enterprise Marketing"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block">Brand Guidelines</label>
                        <button 
                          type="button" 
                          onClick={() => setCurrentView('library')}
                          className="text-[10px] text-indigo-600 font-bold hover:underline"
                        >
                          OPEN LIBRARY
                        </button>
                      </div>
                      <textarea
                        value={guidelines}
                        onChange={(e) => setGuidelines(e.target.value)}
                        placeholder="Paste or upload Tone of Voice, Banned Terms..."
                        className="w-full h-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none font-mono"
                      />
                      <DropZone target="guidelines" label="Guidelines" />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Submitted Content</label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste or upload text to analyze..."
                        className="w-full h-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none italic text-slate-600"
                      />
                      <DropZone target="content" label="Content" />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-[11px] rounded flex items-start gap-2">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isReviewing}
                      className={`w-full py-4 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                        isReviewing ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                      }`}
                    >
                      {isReviewing ? <Loader2 className="animate-spin" size={18} /> : 'Begin Review'}
                    </button>
                  </form>
                </motion.div>
              </section>

              {/* Right Column */}
              <section className="col-span-12 lg:col-span-8 h-full min-h-[500px]">
                <AnimatePresence mode="wait">
                  {!result && !isReviewing && !isProcessingFile && (
                    <motion.div
                      key="empty-ws"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center h-full flex flex-col items-center justify-center space-y-4"
                    >
                      <ShieldCheck className="text-slate-100" size={80} strokeWidth={1} />
                      <div className="max-w-xs">
                        <h3 className="text-lg font-bold text-slate-800 mb-1">Precision Guard Active</h3>
                        <p className="text-sm text-slate-500 leading-relaxed italic">
                          Provide assets to generate a granular brand compliance report.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {isProcessingFile && (
                    <motion.div
                      key="processing-ws"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center h-full flex flex-col items-center justify-center space-y-6"
                    >
                      <Loader2 className="animate-spin text-indigo-600" size={56} strokeWidth={1} />
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-800">Extracting Document Data</h3>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold font-mono">Parsing PDF/PPTX Structure...</p>
                      </div>
                    </motion.div>
                  )}

                  {isReviewing && !result && (
                    <motion.div
                      key="loading-ws"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center h-full flex flex-col items-center justify-center space-y-6"
                    >
                      <Loader2 className="animate-spin text-indigo-600" size={56} strokeWidth={1} />
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-800">Engaging AI Analysis</h3>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold font-mono">Comparing vs Guidelines</p>
                      </div>
                    </motion.div>
                  )}

                  {result && (
                    <motion.div
                      key="result-ws"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-8 relative"
                    >
                      {/* Active Streaming Indicator */}
                      {isReviewing && (
                        <div className="absolute -top-4 right-0 flex items-center gap-2">
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                          </span>
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Analysis in progress...</span>
                        </div>
                      )}
                      {/* Detailed Status Bar */}
                      <div className="flex flex-wrap items-center gap-4">
                        <div className={`px-4 py-2 rounded-lg border-l-4 flex items-center gap-3 shadow-sm ${
                          result.compliance?.includes('Non') 
                            ? 'bg-rose-50 border-rose-500 text-rose-700' 
                            : 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        }`}>
                          {result.compliance?.includes('Non') ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                          <span className="text-sm font-bold uppercase tracking-tight">{result.compliance}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <span className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              result.severity === 'Critical' ? 'bg-rose-500' : 
                              result.severity === 'Moderate' ? 'bg-amber-500' : 'bg-slate-300'
                            }`} />
                            Severity: {result.severity}
                          </span>
                          <span className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-indigo-600">
                            Confidence Score: {result.confidence}
                          </span>
                        </div>
                      </div>

                      {/* Analysis Content Grid */}
                      <div className="grid grid-cols-1 gap-6">
                        {/* Summary Narrative */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
                          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center">
                                <ScrollText size={14} className="text-indigo-600" />
                              </div>
                              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Analysis Engine Report</h4>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono italic">GENERATED: {new Date().toLocaleTimeString()}</span>
                          </div>
                          
                          <div className="p-8 prose prose-slate max-w-none prose-sm leading-relaxed">
                            <div className="markdown-body space-y-4">
                              <ReactMarkdown
                                components={{
                                  h1: ({node, ...props}) => <h2 className="text-base font-bold text-slate-900 mt-8 mb-4 border-l-4 border-indigo-500 pl-4" {...props} />,
                                  h2: ({node, ...props}) => <h3 className="text-sm font-bold text-slate-800 mt-6 mb-3 flex items-center gap-2" {...props} />,
                                  p: ({node, ...props}) => <p className="text-slate-600 mb-4 text-[14px]" {...props} />,
                                  ul: ({node, ...props}) => <ul className="space-y-3 mb-6" {...props} />,
                                  li: ({node, ...props}) => (
                                    <li className="flex items-start gap-2 text-slate-600">
                                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                      <span className="text-sm">{props.children}</span>
                                    </li>
                                  ),
                                  blockquote: ({node, ...props}) => (
                                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 my-6 italic text-slate-500 quote-decoration">
                                      {props.children}
                                    </div>
                                  ),
                                }}
                              >
                                {result.raw}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>

                        {/* Action Module */}
                        <div className={`rounded-2xl border-2 p-6 flex flex-col md:flex-row items-center gap-6 ${
                          result.recommendedAction === 'Approve' 
                            ? 'bg-emerald-50 border-emerald-100' 
                            : 'bg-indigo-50 border-indigo-100'
                        }`}>
                          <div className={`p-4 rounded-xl ${
                            result.recommendedAction === 'Approve' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
                          }`}>
                            {result.recommendedAction === 'Approve' ? <CheckCircle2 size={32} strokeWidth={1.5} /> : <ChevronRight size={32} strokeWidth={1.5} />}
                          </div>
                          <div className="flex-1 text-center md:text-left">
                            <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                              result.recommendedAction === 'Approve' ? 'text-emerald-700' : 'text-indigo-700'
                            }`}>Required Final Action</h4>
                            <p className="text-xl font-bold text-slate-800 mb-2">{result.recommendedAction || 'Needs Revision'}</p>
                            <p className="text-xs text-slate-500 max-w-lg">Based on technical brand guarding parameters, the analysis suggests this content should be prioritized for {result.recommendedAction?.toLowerCase() || 'review'}.</p>
                          </div>
                          <button 
                            onClick={() => window.print()}
                            className="bg-white border border-slate-200 px-6 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                          >
                            Export analysis
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </div>
          </>
        )}

        {/* Library View */}
        {currentView === 'library' && (
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  <Menu size={20} />
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentView('workspace')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all hidden sm:block">
                    <ArrowLeft size={18} />
                  </button>
                  <h2 className="text-sm lg:text-lg font-semibold text-slate-700">Guidelines Library</h2>
                </div>
              </div>
              <button 
                onClick={() => { setGuidelines(''); setDepartment(''); setCurrentView('workspace'); }}
                className="bg-indigo-600 text-white p-2 lg:px-4 lg:py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm"
              >
                <Plus size={16} /> <span className="hidden sm:inline">New Guidelines</span>
              </button>
            </header>

            <div className="p-4 lg:p-8 space-y-6 overflow-y-auto flex-1">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search guidelines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedGuidelines.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())).map(g => (
                  <motion.div 
                    layout
                    key={g.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-indigo-200 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                        <BookOpen size={20} />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => deleteGuideline(g.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1">{g.name}</h4>
                    <p className="text-xs text-slate-500 mb-4 flex items-center gap-2">
                       <span className="bg-slate-100 px-1.5 py-0.5 rounded uppercase font-bold">{g.department || 'N/A'}</span>
                       <span>• Updated {new Date(g.lastUsed).toLocaleDateString()}</span>
                    </p>
                    <button 
                      onClick={() => useGuideline(g)}
                      className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      Use Guideline <ExternalLink size={12} />
                    </button>
                  </motion.div>
                ))}
                {savedGuidelines.length === 0 && (
                  <div className="col-span-full py-20 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                    <Library size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No saved guidelines found. Start by saving guidelines from the Workspace.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History View */}
        {currentView === 'history' && (
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  <Menu size={20} />
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentView('workspace')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all hidden sm:block">
                    <ArrowLeft size={18} />
                  </button>
                  <h2 className="text-sm lg:text-lg font-semibold text-slate-700">Review History</h2>
                </div>
              </div>
            </header>

            <div className="p-4 lg:p-8 space-y-6 overflow-y-auto flex-1">
              <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Type</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliance</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Severity</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 text-sm">
                     {reviewHistory.map(r => (
                       <tr key={r.id} className="hover:bg-slate-50/50 transition-all">
                         <td className="px-6 py-4 text-slate-500">{new Date(r.timestamp).toLocaleString()}</td>
                         <td className="px-6 py-4 font-medium text-slate-700 uppercase text-xs">{r.assetType}</td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                              r.compliance?.includes('Non') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {r.compliance}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                             r.severity === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                           }`}>
                             {r.severity}
                           </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => { setResult(r); setCurrentView('workspace'); }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="View Details"
                              >
                                <ExternalLink size={16} />
                              </button>
                              <button 
                                onClick={() => deleteReview(r.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                         </td>
                       </tr>
                     ))}
                     {reviewHistory.length === 0 && (
                       <tr>
                         <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">
                           No review history detected. Complete a review in the Workspace to populate this log.
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
