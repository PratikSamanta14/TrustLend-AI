import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch, Zap, ChevronRight, AlertCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Navbar from '../components/layout/Navbar';
import FileUpload from '../components/ui/FileUpload';
import ResultsCard from '../components/ui/ResultsCard';
import { analyzeDocument } from '../services/api';

export default function Analyze() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await analyzeDocument(file);
      if (data.status === 'success') setResults({ ...data.data, filename: file.name });
      else setError(data.message || 'Analysis failed.');
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not connect to backend. Make sure Flask is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Navbar title="Analyze Document" subtitle="AI-powered loan agreement analysis" />
      <div style={{ padding: '32px 32px 64px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,92,255,0.15))', border: '1px solid rgba(0,212,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSearch size={22} color="var(--accent-cyan)" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                Loan Document Analysis
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                Upload any loan agreement to detect risks, violations and get a fairness score
              </p>
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: results ? '420px 1fr' : '1fr', gap: 28, transition: 'all 0.4s ease' }}>
          {/* Left panel */}
          <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Upload area */}
            <motion.div layout style={{ borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', padding: '24px', }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <Zap size={15} color="var(--accent-cyan)" />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Upload Document</span>
              </div>
              <FileUpload onFileSelect={setFile} isLoading={loading} label="Drop loan agreement here" />
            </motion.div>

            {/* Analyze button */}
            <AnimatePresence>
              {file && !loading && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <motion.button
                    onClick={handleAnalyze}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,212,255,0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '16px 24px', borderRadius: 14,
                      background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                      border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      boxShadow: '0 0 25px rgba(0,212,255,0.3)',
                    }}
                  >
                    <Zap size={18} /> Analyze with AI
                    <ChevronRight size={16} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '16px 18px', borderRadius: 14, background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <AlertCircle size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)', marginBottom: 4 }}>Analysis Failed</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{error}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'RBI Knowledge Base', val: '8 regulatory documents' },
                { label: 'AI Model', val: 'Gemini 2.5 Flash' },
                { label: 'Analysis Time', val: '~15–30 seconds' },
                { label: 'Supported Formats', val: 'PDF, PNG, JPG' },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderRadius: 10, background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{val}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right panel: results */}
          <AnimatePresence>
            {results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <ResultsCard results={results} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!results && !loading && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: results ? 'none' : 'flex',
                  flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '80px 40px', textAlign: 'center',
                  borderRadius: 20, border: '1.5px dashed var(--border)', gap: 16,
                }}
              >
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                  <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(124,92,255,0.1))', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileSearch size={36} color="var(--accent-cyan)" style={{ opacity: 0.6 }} />
                  </div>
                </motion.div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    No Analysis Yet
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-tertiary)', maxWidth: 320 }}>
                    Upload a loan document on the left and click "Analyze with AI" to get started.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
