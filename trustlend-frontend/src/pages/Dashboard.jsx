import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileSearch, GitCompare, MessageSquare, TrendingUp, ShieldCheck, AlertTriangle, Zap, ArrowRight, BarChart3, Activity, Clock, FileText } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Navbar from '../components/layout/Navbar';
import FairnessMeter from '../components/ui/FairnessMeter';

const recentDocs = [
  { name: 'MicroCredit_Agreement_2024.pdf', score: 42, date: '2h ago', status: 'unfair' },
  { name: 'LoanOffer_Finserv.pdf', score: 78, date: '1d ago', status: 'fair' },
  { name: 'NBFCLoan_Agreement.pdf', score: 55, date: '3d ago', status: 'review' },
];

const quickActions = [
  { icon: FileSearch, label: 'Analyze Document', sub: 'Upload & scan', to: '/analyze', color: 'var(--accent-cyan)' },
  { icon: GitCompare, label: 'Compare Loans', sub: 'Side-by-side', to: '/compare', color: 'var(--accent-purple)' },
  { icon: MessageSquare, label: 'AI Chat', sub: 'Ask questions', to: '/chat', color: 'var(--accent-mint)' },
];

function StatCard({ icon: Icon, label, value, sub, color, delta }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      style={{
        padding: '22px 24px',
        borderRadius: 18,
        background: 'var(--bg-glass)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle, ${color}10, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: `${color}12`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} style={{ color }} />
        </div>
        {delta && (
          <span style={{ fontSize: 11, fontWeight: 700, color: delta > 0 ? 'var(--success)' : 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
            {delta > 0 ? '+' : ''}{delta}%
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>{sub}</div>}
    </motion.div>
  );
}

export default function Dashboard() {
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

  return (
    <AppLayout>
      <Navbar title="Dashboard" subtitle="Welcome back — your financial protection hub" />
      <div style={{ padding: '32px 32px 64px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: '36px 40px', borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,92,255,0.1))',
            border: '1px solid rgba(0,212,255,0.2)',
            marginBottom: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 50%, rgba(124,92,255,0.06), transparent 60%)', pointerEvents: 'none' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                AI SYSTEM ONLINE
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 8 }}>
              Ready to Protect You
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 420 }}>
              Upload a loan document to get an instant AI analysis powered by Gemini 2.5 Flash and RBI regulatory knowledge.
            </p>
          </div>
          <Link to="/analyze" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,212,255,0.5)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '14px 28px', borderRadius: 14,
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#fff',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 0 25px rgba(0,212,255,0.3)',
              }}
            >
              <Zap size={16} /> Analyze Now <ArrowRight size={14} />
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          <StatCard icon={FileText} label="Documents Analyzed" value="0" sub="This session" color="var(--accent-cyan)" delta={null} />
          <StatCard icon={AlertTriangle} label="Risks Found" value="0" sub="Total detections" color="var(--danger)" delta={null} />
          <StatCard icon={ShieldCheck} label="Compliant Docs" value="0" sub="Passed RBI check" color="var(--success)" delta={null} />
          <StatCard icon={BarChart3} label="Avg Fairness" value="—" sub="No data yet" color="var(--accent-purple)" delta={null} />
        </motion.div>

        {/* Quick actions + Recent */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 20 }}>
          {/* Quick actions */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div style={{ borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', padding: '24px', height: '100%' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
                Quick Actions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {quickActions.map(({ icon: Icon, label, sub, to, color }) => (
                  <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                    <motion.div
                      whileHover={{ x: 4, borderColor: color }}
                      style={{
                        padding: '16px 18px', borderRadius: 14,
                        background: 'var(--bg-glass)', border: '1px solid var(--border)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 11, background: `${color}12`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sub}</div>
                      </div>
                      <ArrowRight size={14} color="var(--text-tertiary)" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent documents */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <div style={{ borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', padding: '24px', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Sample Results
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>Demo data</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentDocs.map((doc, i) => {
                  const color = doc.status === 'fair' ? 'var(--success)' : doc.status === 'review' ? 'var(--warning)' : 'var(--danger)';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      whileHover={{ x: 3 }}
                      style={{
                        padding: '16px 18px', borderRadius: 14,
                        background: 'var(--bg-glass)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', gap: 16,
                      }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 11, background: `${color}12`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={18} style={{ color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <Clock size={11} color="var(--text-tertiary)" />
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{doc.date}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}>{doc.score}</div>
                        <div style={{ fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{doc.status}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div style={{ marginTop: 16, padding: '14px', borderRadius: 12, background: 'rgba(0,212,255,0.04)', border: '1px dashed rgba(0,212,255,0.15)', textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>
                  Your analyzed documents will appear here. <Link to="/analyze" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>Analyze one now →</Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
