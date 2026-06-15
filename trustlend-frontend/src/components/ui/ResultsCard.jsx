import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, CheckCircle, ShieldAlert, TrendingUp,
  DollarSign, Calendar, Percent, BookOpen, ChevronDown,
  ChevronUp, FileText, Copy, ExternalLink, Info, Zap,
  Shield, Activity
} from 'lucide-react';
import FairnessMeter from './FairnessMeter';

// Parse [KB ref: ...] tags
function parseKbRef(text) {
  const match = text?.match(/\[KB ref:\s*([^\]]+)\]/i);
  return match
    ? { clean: text.replace(match[0], '').trim(), ref: match[1].trim() }
    : { clean: text || '', ref: null };
}

function refColor(ref) {
  if (!ref) return '#6b7280';
  const r = ref.toLowerCase();
  if (r.includes('penal')) return '#EF4444';
  if (r.includes('kfs')) return '#F97316';
  if (r.includes('benchmark') || r.includes('rate')) return '#8B5CF6';
  if (r.includes('predatory') || r.includes('glossary')) return '#DC2626';
  if (r.includes('fair prac')) return '#3B82F6';
  if (r.includes('nbfc') || r.includes('digital')) return '#06B6D4';
  return '#6B7280';
}

function ScoreCard({ icon: Icon, label, value, color, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '16px 18px',
        borderRadius: 14,
        background: 'var(--bg-glass)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        width: 40, height: 40,
        borderRadius: 10,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
          {label}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: color || 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          {value}
        </div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

function FindingItem({ text, severity = 'high', index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const { clean, ref } = parseKbRef(text);
  const color = severity === 'high' ? 'var(--danger)' : severity === 'medium' ? 'var(--warning)' : 'var(--info)';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        borderRadius: 12,
        border: `1px solid ${color}20`,
        background: `${color}06`,
        overflow: 'hidden',
      }}
    >
      <div
        onClick={() => ref && setExpanded(e => !e)}
        style={{
          padding: '12px 16px',
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          cursor: ref ? 'pointer' : 'default',
        }}
      >
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: color, flexShrink: 0, marginTop: 6,
          boxShadow: `0 0 6px ${color}`,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{clean}</div>
          {ref && (
            <motion.div
              layout
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                marginTop: 6,
                padding: '3px 10px',
                borderRadius: 99,
                background: `${refColor(ref)}15`,
                border: `1px solid ${refColor(ref)}30`,
                fontSize: 10,
                fontWeight: 700,
                color: refColor(ref),
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
              }}
            >
              <BookOpen size={9} />
              {ref}
              {expanded ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, icon: Icon, color = 'var(--text-primary)', children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{
      borderRadius: 16,
      border: '1px solid var(--border)',
      background: 'var(--bg-glass)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          borderBottom: open ? '1px solid var(--border)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon size={16} style={{ color }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color }}>{title}</span>
        </div>
        {open ? <ChevronUp size={14} color="var(--text-tertiary)" /> : <ChevronDown size={14} color="var(--text-tertiary)" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '16px 20px' }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ResultsCard({ results }) {
  const { analysis, fairness, filename } = results;
  const {
    interest_rate, loan_amount, tenure_months,
    hidden_charges_detected, hidden_charges_details = [],
    penalty_clauses = [], risky_terms = [],
    rbi_compliance_issues = [], summary, kb_citations = [],
  } = analysis;
  const { score, breakdown = [] } = fairness;

  const [citationsOpen, setCitationsOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      {/* Header */}
      <motion.div variants={itemVariants} style={{
        padding: '24px 28px',
        borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,92,255,0.06))',
        border: '1px solid rgba(0,212,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,92,255,0.2))',
          border: '1px solid rgba(0,212,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <FileText size={22} color="var(--accent-cyan)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            Analysis Complete
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
            {filename}
          </div>
        </div>
        <div className="badge badge-info" style={{ fontFamily: 'var(--font-mono)' }}>
          <Zap size={10} /> AI Powered
        </div>
      </motion.div>

      {/* Two-column layout: gauge + stats */}
      <motion.div variants={itemVariants} style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, alignItems: 'start',
      }}>
        {/* Gauge */}
        <div style={{
          padding: '28px 24px',
          borderRadius: 20,
          border: '1px solid var(--border)',
          background: 'var(--bg-glass)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 16,
          minWidth: 220,
        }}>
          <FairnessMeter score={score} size={180} />
          <div className="divider" style={{ width: '100%' }} />
          <div style={{ width: '100%' }}>
            {breakdown.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--success)' }}>
                <CheckCircle size={14} /> No major deductions
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                  Score Breakdown
                </div>
                {breakdown.map((item, i) => {
                  const match = item.match(/-(\d+)$/);
                  const deduction = match ? parseInt(match[1]) : 0;
                  const clean = item.replace(/-\d+$/, '').trim();
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: 'var(--danger)',
                        fontFamily: 'var(--font-mono)', flexShrink: 0, marginTop: 1,
                      }}>-{deduction}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{clean}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ScoreCard
              icon={Percent}
              label="Interest Rate"
              value={interest_rate ? `${interest_rate}%` : 'N/A'}
              color={!interest_rate ? 'var(--text-secondary)' : interest_rate > 25 ? 'var(--danger)' : interest_rate > 15 ? 'var(--warning)' : 'var(--success)'}
              sub={interest_rate > 25 ? 'Above RBI guidelines' : interest_rate > 15 ? 'Moderately high' : 'Within fair range'}
            />
            <ScoreCard
              icon={DollarSign}
              label="Loan Amount"
              value={loan_amount ? `₹${Number(loan_amount).toLocaleString('en-IN')}` : 'N/A'}
              color="var(--accent-cyan)"
            />
            <ScoreCard
              icon={Calendar}
              label="Tenure"
              value={tenure_months ? `${tenure_months} months` : 'N/A'}
              color="var(--accent-purple)"
              sub={tenure_months ? `${(tenure_months / 12).toFixed(1)} years` : undefined}
            />
            <ScoreCard
              icon={Shield}
              label="Hidden Charges"
              value={hidden_charges_detected ? 'Detected' : 'None Found'}
              color={hidden_charges_detected ? 'var(--danger)' : 'var(--success)'}
              sub={hidden_charges_detected ? `${hidden_charges_details.length} charge(s)` : 'Transparent'}
            />
          </div>

          {/* Summary */}
          <div style={{
            padding: '18px 20px',
            borderRadius: 14,
            background: 'var(--bg-glass)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Activity size={15} color="var(--accent-cyan)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
                Executive Summary
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              {summary || 'No summary available.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Findings sections */}
      {rbi_compliance_issues.length > 0 && (
        <motion.div variants={itemVariants}>
          <Section title={`RBI Compliance Violations (${rbi_compliance_issues.length})`} icon={ShieldAlert} color="var(--danger)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rbi_compliance_issues.map((item, i) => (
                <FindingItem key={i} text={item} severity="high" index={i} />
              ))}
            </div>
          </Section>
        </motion.div>
      )}

      {risky_terms.length > 0 && (
        <motion.div variants={itemVariants}>
          <Section title={`Risky Clauses (${risky_terms.length})`} icon={AlertTriangle} color="var(--warning)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {risky_terms.map((item, i) => (
                <FindingItem key={i} text={item} severity="medium" index={i} />
              ))}
            </div>
          </Section>
        </motion.div>
      )}

      {(penalty_clauses.length > 0 || hidden_charges_details.length > 0) && (
        <motion.div variants={itemVariants}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {penalty_clauses.length > 0 && (
              <Section title={`Penalty Clauses (${penalty_clauses.length})`} icon={DollarSign} color="var(--warning)" defaultOpen={false}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {penalty_clauses.map((item, i) => (
                    <FindingItem key={i} text={item} severity="medium" index={i} />
                  ))}
                </div>
              </Section>
            )}
            {hidden_charges_details.length > 0 && (
              <Section title={`Hidden Charges (${hidden_charges_details.length})`} icon={Info} color="var(--info)" defaultOpen={false}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {hidden_charges_details.map((item, i) => (
                    <FindingItem key={i} text={item} severity="low" index={i} />
                  ))}
                </div>
              </Section>
            )}
          </div>
        </motion.div>
      )}

      {/* KB Citations */}
      {kb_citations.length > 0 && (
        <motion.div variants={itemVariants}>
          <div style={{
            borderRadius: 16,
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setCitationsOpen(o => !o)}
              style={{
                width: '100%',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg-glass)',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                borderBottom: citationsOpen ? '1px solid var(--border)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <BookOpen size={16} color="var(--accent-purple)" />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>
                  Knowledge Base References
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 99,
                  background: 'var(--accent-purple)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                }}>
                  {kb_citations.length}
                </span>
              </div>
              {citationsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <AnimatePresence>
              {citationsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div style={{ padding: '20px' }}>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
                      Regulatory excerpts retrieved from our knowledge base and used to ground this analysis.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {kb_citations.map((c, i) => (
                        <div key={i} style={{
                          borderRadius: 10,
                          background: `${refColor(c.source_label)}08`,
                          border: `1px solid ${refColor(c.source_label)}20`,
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            padding: '8px 14px',
                            background: `${refColor(c.source_label)}10`,
                            borderBottom: `1px solid ${refColor(c.source_label)}15`,
                            display: 'flex', alignItems: 'center', gap: 8,
                          }}>
                            <BookOpen size={11} style={{ color: refColor(c.source_label) }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: refColor(c.source_label), fontFamily: 'var(--font-mono)' }}>
                              {c.source_label}
                            </span>
                          </div>
                          <div style={{
                            padding: '10px 14px',
                            fontSize: 12,
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            fontFamily: 'var(--font-mono)',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}>
                            {c.excerpt}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
