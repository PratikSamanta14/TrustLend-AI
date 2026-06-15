import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, Zap, Trophy, AlertCircle, ChevronRight, Minus, ArrowRight } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Navbar from '../components/layout/Navbar';
import FileUpload from '../components/ui/FileUpload';
import FairnessMeter from '../components/ui/FairnessMeter';
import { compareDocuments } from '../services/api';

function LoanColumn({ label, result, color }) {
  if (!result) return null;
  const { analysis, fairness } = result;
  const { interest_rate, loan_amount, tenure_months, hidden_charges_detected, penalty_clauses = [], risky_terms = [], rbi_compliance_issues = [] } = analysis;
  const { score } = fairness;

  const stats = [
    { label: 'Interest Rate', val: interest_rate ? `${interest_rate}%` : 'N/A', warning: interest_rate > 20 },
    { label: 'Loan Amount', val: loan_amount ? `₹${Number(loan_amount).toLocaleString('en-IN')}` : 'N/A' },
    { label: 'Tenure', val: tenure_months ? `${tenure_months} mo` : 'N/A' },
    { label: 'Hidden Charges', val: hidden_charges_detected ? 'Yes' : 'No', warning: hidden_charges_detected },
    { label: 'Penalty Clauses', val: penalty_clauses.length, warning: penalty_clauses.length > 0 },
    { label: 'Risky Terms', val: risky_terms.length, warning: risky_terms.length > 0 },
    { label: 'RBI Violations', val: rbi_compliance_issues.length, warning: rbi_compliance_issues.length > 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 20, border: `1px solid ${color}30`,
        background: `linear-gradient(135deg, ${color}05, rgba(0,0,0,0))`,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: `${color}08` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {result.filename}
        </div>
      </div>

      {/* Gauge */}
      <div style={{ padding: '28px', display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--border)' }}>
        <FairnessMeter score={score} size={160} />
      </div>

      {/* Stats */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {stats.map(({ label: l, val, warning }) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l}</span>
            <span style={{
              fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)',
              color: warning ? 'var(--danger)' : 'var(--text-primary)',
            }}>
              {String(val)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Compare() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const canCompare = file1 && file2 && !loading;

  const handleCompare = async () => {
    if (!canCompare) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await compareDocuments(file1, file2);
      if (data.status === 'success') {
        const verdict = data.data.verdict;
        const verdictMessage = verdict?.winner === 'tie'
          ? 'Both loans are roughly equal in fairness.'
          : `${verdict?.winner_label} is fairer by ${verdict?.score_diff || 0} points.`;

        setResults({
          loan1: { ...data.data.loan_a, filename: file1.name },
          loan2: { ...data.data.loan_b, filename: file2.name },
          verdict: verdictMessage,
          keyDifferences: verdict?.key_differences || [],
        });
      } else setError(data.message || 'Comparison failed.');
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Navbar title="Compare Loans" subtitle="Side-by-side fairness analysis" />
      <div style={{ padding: '32px 32px 64px', maxWidth: 1100, margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(124,92,255,0.15), rgba(0,212,255,0.1))', border: '1px solid rgba(124,92,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GitCompare size={22} color="var(--accent-purple)" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Loan Comparison</h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Upload two documents and let AI decide which is fairer</p>
            </div>
          </div>
        </motion.div>

        {/* Upload row */}
        {!results && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'start', marginBottom: 28 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg-glass)', padding: 24 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--accent-cyan)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>Loan Option A</div>
              <FileUpload onFileSelect={setFile1} isLoading={loading && !file1} label="Drop first loan document" />
            </motion.div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, marginTop: 60 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-glass)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Minus size={18} color="var(--text-tertiary)" />
              </div>
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg-glass)', padding: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: 'var(--accent-purple)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Loan Option B</div>
              <FileUpload onFileSelect={setFile2} isLoading={loading && !file2} label="Drop second loan document" />
            </motion.div>
          </div>
        )}

        {/* Compare button */}
        {!results && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <motion.button
              onClick={handleCompare}
              disabled={!canCompare}
              whileHover={canCompare ? { scale: 1.04, boxShadow: '0 0 40px rgba(124,92,255,0.5)' } : {}}
              whileTap={canCompare ? { scale: 0.97 } : {}}
              style={{
                padding: '16px 48px', borderRadius: 14,
                background: canCompare ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))' : 'var(--bg-glass)',
                border: canCompare ? 'none' : '1px solid var(--border)',
                cursor: canCompare ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
                color: canCompare ? '#fff' : 'var(--text-tertiary)',
                display: 'flex', alignItems: 'center', gap: 10,
                opacity: canCompare ? 1 : 0.5,
                transition: 'all 0.3s',
              }}
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%' }} />
                  Comparing...
                </>
              ) : (
                <>
                  <GitCompare size={18} /> Compare Now <ChevronRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: '16px 18px', borderRadius: 14, background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <AlertCircle size={18} color="var(--danger)" />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Verdict Banner */}
              {results.verdict && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    padding: '28px 36px', borderRadius: 20, marginBottom: 28,
                    background: 'linear-gradient(135deg, rgba(0,255,200,0.08), rgba(124,92,255,0.08))',
                    border: '1px solid rgba(0,255,200,0.25)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
                    <Trophy size={22} color="var(--warning)" />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                      Verdict
                    </span>
                  </div>
                  <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto' }}>
                    {results.verdict}
                  </p>
                  {results.keyDifferences?.length > 0 && (
                    <div style={{ marginTop: 18, textAlign: 'left', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Key differences</div>
                      <ul style={{ paddingLeft: 20, margin: 0, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
                        {results.keyDifferences.map((diff, index) => (
                          <li key={index} style={{ marginBottom: 8 }}>{diff}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Side-by-side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'start' }}>
                <LoanColumn label="Loan A" result={results.loan1} color="var(--accent-cyan)" />

                {/* VS divider */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 80 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: '#fff',
                    boxShadow: '0 0 20px rgba(0,212,255,0.3)',
                  }}>VS</div>
                  <ArrowRight size={16} color="var(--text-tertiary)" />
                </div>

                <LoanColumn label="Loan B" result={results.loan2} color="var(--accent-purple)" />
              </div>

              {/* Reset */}
              <div style={{ textAlign: 'center', marginTop: 28 }}>
                <motion.button
                  onClick={() => { setResults(null); setFile1(null); setFile2(null); }}
                  whileHover={{ scale: 1.03 }}
                  style={{
                    padding: '12px 28px', borderRadius: 12,
                    background: 'var(--bg-glass)', border: '1px solid var(--border)',
                    cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)',
                  }}
                >
                  Compare Different Documents
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
