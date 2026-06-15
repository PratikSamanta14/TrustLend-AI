import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Zap, Eye, GitCompare, MessageSquare,
  ArrowRight, CheckCircle, TrendingDown, FileSearch,
  Lock, Globe, BarChart3, Star, ChevronDown,
  Sparkles, Activity, Shield, Users, FileText,
  AlertTriangle, BookOpen, Twitter, Github, Linkedin
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

// ─── Counter animation ───────────────────────────────────────────
function Counter({ end, suffix = '', prefix = '', duration = 2500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const step = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * end));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ─── Animated orb / hero background ─────────────────────────────
function HeroBg({ isDark }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Grid */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

      {/* Orbs */}
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '60%', height: '60%',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(8,145,178,0.12) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />
      <motion.div animate={{ scale: [1.1, 1, 1.1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute', bottom: '-10%', right: '-10%',
          width: '55%', height: '55%',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(124,92,255,0.22) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }} />
      <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute', top: '40%', right: '25%',
          width: '25%', height: '25%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,200,0.12) 0%, transparent 65%)',
          filter: 'blur(30px)',
        }} />

      {/* Particle dots */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4 + (i % 4),
            repeat: Infinity,
            delay: (i * 0.3) % 5,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: `${5 + (i * 4.7) % 90}%`,
            top: `${10 + (i * 3.1) % 80}%`,
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            borderRadius: '50%',
            background: i % 2 === 0 ? 'var(--accent-cyan)' : 'var(--accent-purple)',
          }}
        />
      ))}
    </div>
  );
}

// ─── 3D-like floating document visual ────────────────────────────
function FloatingDocument({ isDark }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto' }}>
      {/* Main doc card */}
      <motion.div
        className="float"
        style={{
          borderRadius: 24,
          background: isDark ? 'rgba(10,17,40,0.9)' : 'rgba(255,255,255,0.9)',
          border: '1px solid var(--border-strong)',
          backdropFilter: 'blur(30px)',
          padding: '28px 32px',
          boxShadow: isDark
            ? '0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(0,212,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)'
            : '0 40px 80px rgba(15,23,42,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Scan line animation */}
        <motion.div
          animate={{ y: ['0%', '380%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
          style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.6), transparent)',
            pointerEvents: 'none',
            zIndex: 10,
            top: 28,
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileText size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>MicroCredit_Agreement.pdf</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Analyzing...</div>
            </div>
          </div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              padding: '4px 12px', borderRadius: 99,
              background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
              fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)',
              fontFamily: 'var(--font-mono)',
            }}
          >● LIVE</motion.div>
        </div>

        {/* Text lines */}
        {[
          { w: '100%', color: 'var(--text-primary)', h: 10 },
          { w: '85%', color: 'var(--text-secondary)', h: 8 },
          { w: '92%', color: 'var(--text-secondary)', h: 8 },
          { w: '60%', color: 'var(--text-secondary)', h: 8 },
        ].map((l, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
            style={{
              height: l.h, borderRadius: 4, marginBottom: 10,
              width: l.w, background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
              transformOrigin: 'left',
            }}
          />
        ))}

        {/* Highlighted risky clause */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            marginTop: 16,
            padding: '12px 16px',
            borderRadius: 10,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={13} color="var(--danger)" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              RISKY CLAUSE DETECTED
            </span>
          </div>
          <div style={{ height: 7, borderRadius: 3, width: '90%', background: 'rgba(239,68,68,0.2)', marginBottom: 5 }} />
          <div style={{ height: 7, borderRadius: 3, width: '70%', background: 'rgba(239,68,68,0.15)' }} />
        </motion.div>

        {/* Scores row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {[
            { label: 'Fairness', val: 42, color: 'var(--warning)' },
            { label: 'Risk', val: 'HIGH', color: 'var(--danger)' },
            { label: 'RBI', val: '✓ 3 Issues', color: 'var(--danger)' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{
              flex: 1, padding: '10px 12px', borderRadius: 10,
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>{val}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating badge — top right */}
      <motion.div
        className="float-2"
        style={{
          position: 'absolute', top: -20, right: -20, zIndex: 3,
          padding: '10px 16px', borderRadius: 14,
          background: isDark ? 'rgba(0,255,200,0.1)' : 'rgba(5,150,105,0.1)',
          border: '1px solid rgba(0,255,200,0.3)',
          backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 8px 32px rgba(0,255,200,0.15)',
        }}
      >
        <ShieldCheck size={16} color="var(--success)" />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>RBI Verified</div>
          <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Guidelines 2024</div>
        </div>
      </motion.div>

      {/* Floating badge — bottom left */}
      <motion.div
        className="float-3"
        style={{
          position: 'absolute', bottom: -18, left: -24, zIndex: 3,
          padding: '10px 16px', borderRadius: 14,
          background: isDark ? 'rgba(124,92,255,0.12)' : 'rgba(109,40,217,0.08)',
          border: '1px solid rgba(124,92,255,0.3)',
          backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 8px 32px rgba(124,92,255,0.2)',
        }}
      >
        <Sparkles size={14} color="var(--accent-purple)" />
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-purple)' }}>Gemini 2.5 Flash</div>
      </motion.div>
    </div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────
const features = [
  {
    icon: Zap, title: 'AI Simplification', color: '#00D4FF',
    desc: 'Converts dense legal jargon into plain language summaries anyone can understand in seconds.',
  },
  {
    icon: AlertTriangle, title: 'Risk Detection', color: '#FF4D6D',
    desc: 'Flags predatory lending indicators, excessive interest, hidden fees and unfair penalty clauses.',
  },
  {
    icon: ShieldCheck, title: 'Fairness Analysis', color: '#00FFC8',
    desc: 'Calculates a 0–100 transparency score benchmarked against RBI guidelines and market rates.',
  },
  {
    icon: Globe, title: 'Multi-language', color: '#A855F7',
    desc: 'Ask questions and receive explanations in Bengali, Hindi, Tamil, Telugu and 12 other languages.',
  },
  {
    icon: BookOpen, title: 'Clause Extraction', color: '#F59E0B',
    desc: 'Automatically identifies and highlights every material clause, condition and obligation.',
  },
  {
    icon: GitCompare, title: 'Loan Comparison', color: '#7C5CFF',
    desc: 'Compare two offers side-by-side with a clear winner verdict and score differential.',
  },
  {
    icon: MessageSquare, title: 'AI Chat', color: '#3B82F6',
    desc: 'Ask any question about your document in natural language and get instant grounded answers.',
  },
  {
    icon: BarChart3, title: 'Transparency Score', color: '#10B981',
    desc: 'A proprietary scoring model powered by 8 RBI regulatory documents and lending benchmarks.',
  },
];

// ─── How it works ──────────────────────────────────────────────────
const steps = [
  { n: '01', title: 'Upload Document', desc: 'Drag and drop your loan agreement, microfinance contract or any financial document. PDF, PNG or JPG supported.', icon: FileText, color: 'var(--accent-cyan)' },
  { n: '02', title: 'AI Analyzes', desc: 'Our Gemini-powered engine scans every clause using RBI regulatory knowledge, identifying risks in seconds.', icon: Zap, color: 'var(--accent-purple)' },
  { n: '03', title: 'Understand', desc: 'Review simplified clauses, risk flags, fairness score and compliance violations in a beautiful dashboard.', icon: Eye, color: 'var(--accent-mint)' },
  { n: '04', title: 'Ask Questions', desc: 'Chat with your document. Ask about interest rates, hidden charges, penalties — in your language.', icon: MessageSquare, color: 'var(--warning)' },
  { n: '05', title: 'Make Better Decisions', desc: 'Download a full AI-generated report and go to your lender empowered with knowledge.', icon: ShieldCheck, color: 'var(--success)' },
];

const metrics = [
  { val: 12500, suffix: '+', label: 'Documents Analyzed', icon: FileSearch, color: 'var(--accent-cyan)' },
  { val: 48000, suffix: '+', label: 'Risks Detected', icon: AlertTriangle, color: 'var(--danger)' },
  { val: 95000, suffix: '+', label: 'Clauses Simplified', icon: CheckCircle, color: 'var(--success)' },
  { val: 8200, suffix: '+', label: 'Users Protected', icon: Users, color: 'var(--accent-purple)' },
];

const testimonials = [
  {
    text: 'TrustLend revealed hidden processing fees and a prepayment penalty in my microfinance loan. I renegotiated and saved over ₹12,000.',
    author: 'Priya S.',
    role: 'Small Business Owner, Kolkata',
    rating: 5,
  },
  {
    text: 'As a financial counselor I use TrustLend daily. The RBI compliance analysis is incredibly accurate and saves hours of manual review.',
    author: 'Rahul M.',
    role: 'Financial Advisor, Mumbai',
    rating: 5,
  },
  {
    text: 'The AI chat feature is incredible — I asked questions in Bengali and got perfect answers with exact clause references. Game changer.',
    author: 'Ananya D.',
    role: 'Self-help Group Leader, West Bengal',
    rating: 5,
  },
];

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(a => (a + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '0 40px',
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: isDark ? 'rgba(5,8,22,0.8)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <motion.div whileHover={{ scale: 1.05 }} style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,212,255,0.4)',
          }}>
            <ShieldCheck size={20} color="#fff" />
          </motion.div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            TrustLend <span style={{ color: 'var(--accent-cyan)' }}>AI</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[
            { label: 'Analyze', to: '/analyze' },
            { label: 'Compare', to: '/compare' },
            { label: 'Chat', to: '/chat' },
            { label: 'Dashboard', to: '/dashboard' },
          ].map(({ label, to }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <motion.span
                whileHover={{ color: 'var(--accent-cyan)' }}
                style={{
                  padding: '8px 16px', borderRadius: 99, fontSize: 14, fontWeight: 500,
                  color: 'var(--text-secondary)', cursor: 'pointer', display: 'block',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </motion.span>
            </Link>
          ))}

          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--bg-glass)', border: '1px solid var(--border)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </motion.button>

          <Link to="/analyze" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(0,212,255,0.4)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '9px 22px', borderRadius: 99,
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, color: '#fff',
                fontFamily: 'var(--font-display)',
                boxShadow: '0 0 20px rgba(0,212,255,0.25)',
              }}
            >
              Get Started →
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 68, overflow: 'hidden' }}>
        <HeroBg isDark={isDark} />
        <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            {/* Left: Copy */}
            <motion.div style={{ y: heroY, opacity: heroOpacity }}>
              <motion.div
                variants={stagger} initial="hidden" animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
              >
                {/* Badge */}
                <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', width: 'fit-content' }}>
                  <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
                    POWERED BY GEMINI 2.5 FLASH
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1 variants={fadeUp} style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 5vw, 68px)',
                  fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                }}>
                  Understand Every<br />
                  <span className="gradient-text">Loan Before</span><br />
                  You Sign.
                </motion.h1>

                {/* Sub */}
                <motion.p variants={fadeUp} style={{
                  fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7,
                  maxWidth: 480, fontWeight: 300,
                }}>
                  AI-powered transparency for microfinance, lending agreements, and financial contracts.
                  Detect risks, understand clauses, protect yourself.
                </motion.p>

                {/* CTAs */}
                <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link to="/analyze" style={{ textDecoration: 'none' }}>
                    <motion.button
                      whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,212,255,0.5)' }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '14px 32px', borderRadius: 14,
                        background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                        border: 'none', cursor: 'pointer',
                        fontSize: 16, fontWeight: 700, color: '#fff',
                        fontFamily: 'var(--font-display)',
                        display: 'flex', alignItems: 'center', gap: 10,
                        boxShadow: '0 0 30px rgba(0,212,255,0.3)',
                      }}
                    >
                      <FileSearch size={18} /> Analyze Document
                    </motion.button>
                  </Link>
                  <Link to="/chat" style={{ textDecoration: 'none' }}>
                    <motion.button
                      whileHover={{ scale: 1.03, background: 'var(--bg-glass-hover)' }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '14px 28px', borderRadius: 14,
                        background: 'var(--bg-glass)', border: '1px solid var(--border-strong)',
                        cursor: 'pointer', fontSize: 16, fontWeight: 600,
                        color: 'var(--text-primary)',
                        display: 'flex', alignItems: 'center', gap: 8,
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      <MessageSquare size={17} /> Try AI Chat
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Trust indicators */}
                <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  {[
                    { icon: ShieldCheck, text: 'RBI Guidelines' },
                    { icon: Lock, text: 'Private & Secure' },
                    { icon: Zap, text: 'Instant Analysis' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <Icon size={14} color="var(--accent-cyan)" />
                      {text}
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'relative' }}
            >
              <FloatingDocument isDark={isDark} />
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              color: 'var(--text-tertiary)', fontSize: 12, fontFamily: 'var(--font-mono)',
            }}
          >
            <span style={{ letterSpacing: '0.08em' }}>SCROLL</span>
            <ChevronDown size={16} />
          </motion.div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: isDark ? 'rgba(7,16,33,0.5)' : 'rgba(240,244,255,0.5)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {metrics.map(({ val, suffix, label, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  padding: '28px 24px',
                  borderRadius: 20,
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(circle at 50% 0%, ${color}08, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <div style={{
                  width: 44, height: 44, borderRadius: 12, margin: '0 auto 16px',
                  background: `${color}12`,
                  border: `1px solid ${color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800,
                  color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1,
                }}>
                  <Counter end={val} suffix={suffix} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 99, background: 'rgba(124,92,255,0.1)', border: '1px solid rgba(124,92,255,0.2)', marginBottom: 20 }}>
              <Sparkles size={12} color="var(--accent-purple)" />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-purple)', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
                CAPABILITIES
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 16 }}>
              Everything You Need to<br />
              <span className="gradient-text">Understand Loans</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              Built on RBI regulatory knowledge, microfinance best practices, and state-of-the-art AI.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {features.map(({ icon: Icon, title, color, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 4) * 0.08, duration: 0.5 }}
                whileHover={{ y: -6, boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${color}15` }}
                style={{
                  padding: '24px',
                  borderRadius: 20,
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border)',
                  cursor: 'default',
                  transition: 'box-shadow 0.3s, border-color 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 100, height: 100,
                  background: `radial-gradient(circle, ${color}08, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                  background: `${color}12`, border: `1px solid ${color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '100px 0', background: isDark ? 'rgba(7,16,33,0.6)' : 'rgba(240,244,255,0.6)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-sm">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 99, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', marginBottom: 20 }}>
              <Activity size={12} color="var(--accent-cyan)" />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
                HOW IT WORKS
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              From Document to<br />
              <span className="gradient-text">Clarity in Seconds</span>
            </h2>
          </motion.div>

          <div style={{ position: 'relative' }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute', left: 32, top: 48, bottom: 48,
              width: 2,
              background: 'linear-gradient(180deg, var(--accent-cyan), var(--accent-purple), var(--accent-mint))',
              opacity: 0.3,
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {steps.map(({ n, title, desc, icon: Icon, color }, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  style={{
                    display: 'flex', gap: 24, alignItems: 'flex-start',
                    padding: '24px',
                    borderRadius: 18,
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border)',
                    position: 'relative',
                  }}
                >
                  {/* Number disc */}
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                    background: `${color}12`, border: `2px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: 2,
                    position: 'relative', zIndex: 1,
                  }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: color, letterSpacing: '0.1em' }}>{n}</span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {title}
                      </h3>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '100px 0' }}>
        <div className="container-sm">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 12 }}>
              Trusted by <span className="gradient-text">Thousands</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>People who protected themselves with TrustLend AI</p>
          </motion.div>

          <div style={{ position: 'relative' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{
                  padding: '40px 48px',
                  borderRadius: 24,
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-strong)',
                  textAlign: 'center',
                  maxWidth: 680,
                  margin: '0 auto',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(circle at 50% 0%, rgba(0,212,255,0.05), transparent 60%)',
                  pointerEvents: 'none',
                }} />
                {/* Quote mark */}
                <div style={{ fontSize: 72, lineHeight: 0.8, color: 'var(--accent-cyan)', opacity: 0.2, fontFamily: 'Georgia', marginBottom: 20 }}>"</div>

                <p style={{ fontSize: 18, color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: 28, fontWeight: 300, fontStyle: 'italic' }}>
                  {testimonials[activeTestimonial].text}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                    <Star key={i} size={16} fill="var(--warning)" color="var(--warning)" />
                  ))}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>
                  {testimonials[activeTestimonial].author}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {testimonials[activeTestimonial].role}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)} style={{
                  width: i === activeTestimonial ? 24 : 8,
                  height: 8, borderRadius: 99,
                  background: i === activeTestimonial ? 'var(--accent-cyan)' : 'var(--border-strong)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              padding: '64px',
              borderRadius: 32,
              background: 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(124,92,255,0.12) 50%, rgba(0,255,200,0.08) 100%)',
              border: '1px solid rgba(0,212,255,0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(0,212,255,0.06), transparent 60%)', pointerEvents: 'none' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 16 }}>
              Ready to Understand<br />
              <span className="gradient-text">Your Loan Agreement?</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
              Upload any lending document and get a full AI analysis in under 30 seconds. Free to use.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/analyze" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(0,212,255,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '16px 40px', borderRadius: 14,
                    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                    border: 'none', cursor: 'pointer',
                    fontSize: 16, fontWeight: 700, color: '#fff',
                    fontFamily: 'var(--font-display)',
                    display: 'flex', alignItems: 'center', gap: 10,
                    boxShadow: '0 0 30px rgba(0,212,255,0.3)',
                  }}
                >
                  <FileSearch size={18} /> Analyze Free — No Sign Up
                </motion.button>
              </Link>
              <Link to="/compare" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  style={{
                    padding: '16px 32px', borderRadius: 14,
                    background: 'var(--bg-glass)', border: '1px solid var(--border-strong)',
                    cursor: 'pointer', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)',
                    display: 'flex', alignItems: 'center', gap: 8,
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <GitCompare size={16} /> Compare Two Loans
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '48px 0', background: isDark ? 'rgba(5,8,22,0.8)' : 'rgba(240,244,255,0.8)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={18} color="#fff" />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>TrustLend AI</span>
              </Link>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 280, marginBottom: 20 }}>
                Empowering every borrower with AI-powered transparency and legal clarity for microfinance agreements.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <motion.a key={i} href="#" whileHover={{ scale: 1.1, color: 'var(--accent-cyan)' }} style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: 'var(--bg-glass)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-secondary)', textDecoration: 'none',
                  }}>
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Analyze', 'Compare', 'AI Chat', 'Dashboard', 'Reports'] },
              { title: 'Resources', links: ['RBI Guidelines', 'FAQs', 'API Docs', 'Changelog'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Use', 'Disclaimer', 'Contact'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 16, letterSpacing: '0.04em' }}>
                  {title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {links.map(link => (
                    <a key={link} href="#" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'var(--accent-cyan)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                    >{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>© 2025 TrustLend AI. Built for financial transparency.</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              Powered by Gemini 2.5 Flash · RAG · RBI KB v2024
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
