import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Paperclip, Zap, FileText, Copy, RotateCcw, ThumbsUp, ThumbsDown, User, Bot, Sparkles, X } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Navbar from '../components/layout/Navbar';
import { analyzeDocument } from '../services/api';

const QUICK_QUESTIONS = [
  'What is the interest rate?',
  'Are there any hidden charges?',
  'What are the risky clauses?',
  'Is this loan RBI compliant?',
  'Summarize in simple language',
  'What are the penalty clauses?',
];

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
          style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-cyan)', opacity: 0.7 }}
        />
      ))}
    </div>
  );
}

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: 12,
        alignItems: 'flex-start',
        maxWidth: '100%',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: isUser
          ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-violet))'
          : 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: isUser ? '0 0 12px rgba(124,92,255,0.4)' : '0 0 12px rgba(0,212,255,0.4)',
      }}>
        {isUser ? <User size={15} color="#fff" /> : <Bot size={15} color="#fff" />}
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap: 6 }}>
        <div style={{
          padding: '14px 18px',
          borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
          background: isUser
            ? 'linear-gradient(135deg, rgba(124,92,255,0.25), rgba(0,212,255,0.15))'
            : 'var(--bg-glass)',
          border: isUser
            ? '1px solid rgba(124,92,255,0.3)'
            : '1px solid var(--border)',
          backdropFilter: 'blur(20px)',
          maxWidth: '85%',
        }}>
          {msg.typing ? (
            <TypingDots />
          ) : (
            <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {msg.content}
            </p>
          )}
        </div>

        {/* Actions */}
        {!msg.typing && !isUser && (
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { icon: copied ? () => <span style={{ fontSize: 10 }}>✓</span> : Copy, onClick: copy, title: copied ? 'Copied!' : 'Copy' },
              { icon: ThumbsUp, title: 'Helpful' },
              { icon: ThumbsDown, title: 'Not helpful' },
            ].map(({ icon: Icon, onClick, title }) => (
              <motion.button
                key={title}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClick}
                title={title}
                style={{
                  width: 26, height: 26, borderRadius: 8,
                  background: 'var(--bg-glass)', border: '1px solid var(--border)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-tertiary)',
                }}
              >
                <Icon size={11} />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'assistant',
      content: "👋 Hello! I'm TrustLend AI. Upload a loan document above, then ask me anything about it — interest rates, hidden charges, risky clauses, RBI compliance, or anything else. I'll explain it clearly.",
    }
  ]);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analysisContext, setAnalysisContext] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const uploadDoc = async (file) => {
    setUploading(true);
    setUploadedFile(file);
    addMessage('assistant', `📄 Analyzing **${file.name}**...`, true);
    try {
      const data = await analyzeDocument(file);
      if (data.status === 'success') {
        setAnalysisContext(data.data);
        addMessage('assistant',
          `✅ **Document analyzed!** I've processed "${file.name}".\n\n` +
          `Here's a quick summary:\n` +
          `• **Fairness Score:** ${data.data.fairness?.score ?? 'N/A'}/100\n` +
          `• **Interest Rate:** ${data.data.analysis?.interest_rate ?? 'N/A'}%\n` +
          `• **Hidden Charges:** ${data.data.analysis?.hidden_charges_detected ? 'Detected ⚠️' : 'None found ✅'}\n` +
          `• **RBI Violations:** ${data.data.analysis?.rbi_compliance_issues?.length ?? 0}\n\n` +
          `You can now ask me anything about this loan. What would you like to know?`
        );
      } else {
        addMessage('assistant', `⚠️ I couldn't fully analyze the document. Error: ${data.message}\n\nYou can still ask me general questions about loan agreements!`);
      }
    } catch (e) {
      addMessage('assistant', `⚠️ Couldn't reach the backend. Make sure Flask is running.\n\nYou can still ask me general questions about microfinance and loans!`);
    } finally {
      setUploading(false);
    }
  };

  const addMessage = (role, content, replaceLast = false) => {
    setMessages(prev => {
      const withoutTyping = prev.filter(m => !m.typing);
      const newMsg = { id: Date.now() + Math.random(), role, content };
      return replaceLast ? [...withoutTyping.slice(0, -1), newMsg] : [...withoutTyping, newMsg];
    });
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isThinking) return;
    setInput('');

    setMessages(prev => [...prev.filter(m => !m.typing), { id: Date.now(), role: 'user', content: text }]);
    setIsThinking(true);
    setMessages(prev => [...prev, { id: 'typing', role: 'assistant', typing: true }]);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 800));

    let reply = '';
    const ctx = analysisContext;
    const lower = text.toLowerCase();

    if (ctx) {
      const a = ctx.analysis;
      if (lower.includes('interest') || lower.includes('rate')) {
        reply = a.interest_rate
          ? `The interest rate in this document is **${a.interest_rate}%** per annum.\n\nAccording to RBI Fair Practices Code, lenders must disclose annualised interest rates transparently. ${a.interest_rate > 24 ? `⚠️ This rate of ${a.interest_rate}% exceeds typical NBFC benchmarks of 18–24% and may indicate predatory lending.` : a.interest_rate > 15 ? `This is moderately high compared to bank rates of 10–14%.` : `This is within the fair range.`}`
          : `I couldn't detect an explicit interest rate. The document may express it differently — look for "IRR", "flat rate", or "APR" mentions.`;
      } else if (lower.includes('hidden') || lower.includes('charge') || lower.includes('fee')) {
        reply = a.hidden_charges_detected
          ? `⚠️ **Hidden charges were detected** in this document:\n\n${a.hidden_charges_details?.map((c, i) => `${i + 1}. ${c}`).join('\n') || 'Details not extracted.'}\n\nRBI KFS (Key Facts Statement) guidelines require all charges to be disclosed upfront. You can ask the lender for a complete fee schedule.`
          : `✅ No hidden charges were detected in this document. All fees appear to be disclosed transparently, which is in line with RBI's Key Facts Statement requirements.`;
      } else if (lower.includes('rbi') || lower.includes('compliance')) {
        reply = a.rbi_compliance_issues?.length
          ? `⚠️ **${a.rbi_compliance_issues.length} RBI compliance issue(s) detected:**\n\n${a.rbi_compliance_issues.map((v, i) => `${i + 1}. ${v}`).join('\n\n')}\n\nYou should request the lender to clarify or rectify these issues before signing.`
          : `✅ No significant RBI compliance violations were found. The document appears to follow the Fair Practices Code guidelines.`;
      } else if (lower.includes('risk') || lower.includes('clause') || lower.includes('risky')) {
        reply = a.risky_terms?.length
          ? `⚠️ **${a.risky_terms.length} risky clause(s) identified:**\n\n${a.risky_terms.map((t, i) => `${i + 1}. ${t}`).join('\n\n')}\n\nThese clauses may put you at a disadvantage. I recommend consulting a financial advisor before signing.`
          : `✅ No significantly risky terms were identified in this document.`;
      } else if (lower.includes('summar') || lower.includes('explain') || lower.includes('simple')) {
        reply = a.summary || `Here's a plain-language summary based on the document:\n\nThis is a loan agreement with an interest rate of ${a.interest_rate ?? 'undisclosed'}% over ${a.tenure_months ?? 'an unstated'} months. The fairness score is ${ctx.fairness?.score}/100 — ${ctx.fairness?.score >= 75 ? 'which is fair.' : ctx.fairness?.score >= 45 ? 'which needs review.' : 'which indicates potential predatory terms.'}`;
      } else if (lower.includes('penalty')) {
        reply = a.penalty_clauses?.length
          ? `**${a.penalty_clauses.length} penalty clause(s) found:**\n\n${a.penalty_clauses.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}\n\nPenalty charges must comply with RBI Penal Charges Circular (2023) — they should be reasonable and disclosed in the KFS.`
          : `✅ No explicit penalty clauses were detected in this document.`;
      } else if (lower.includes('score') || lower.includes('fair')) {
        const score = ctx.fairness?.score;
        reply = `The **Fairness Score for this document is ${score}/100**.\n\n${score >= 75 ? '✅ This is a FAIR agreement — terms appear reasonable and RBI compliant.' : score >= 45 ? '⚠️ This needs REVIEW — some terms are unfavorable but not extreme.' : '🚨 This is UNFAIR — significant predatory indicators detected.'}\n\nScore breakdown:\n${ctx.fairness?.breakdown?.map(b => `• ${b}`).join('\n') || '• See full analysis for details.'}`;
      } else {
        reply = `Based on my analysis of "${uploadedFile?.name}":\n\n${a.summary || 'The document has been analyzed.'}\n\nFairness Score: ${ctx.fairness?.score}/100.\n\nCould you be more specific? I can explain interest rates, hidden charges, penalty clauses, RBI compliance issues, or risky terms.`;
      }
    } else {
      // General knowledge
      if (lower.includes('interest')) {
        reply = `In India, microfinance loan interest rates are regulated by the RBI. NBFC-MFIs are typically capped at a margin of 10–12% over their cost of funds. Rates above 24% p.a. are generally considered high. Always check for the Annual Percentage Rate (APR) rather than just the flat rate.\n\n💡 **Tip:** Upload your loan document above and I can check the exact rate for you.`;
      } else if (lower.includes('rbi') || lower.includes('microfinance')) {
        reply = `The RBI has issued several regulations protecting microfinance borrowers:\n\n1. **Fair Practices Code (FPC)** — requires transparent terms\n2. **KFS Guidelines (2024)** — Key Facts Statement with all charges upfront\n3. **Penal Charges Circular (2023)** — limits excessive penalties\n4. **NBFC-MFI Directions** — caps on interest and loan size\n\n💡 Upload your document and I'll check it against all of these.`;
      } else {
        reply = `That's a great question! I'm most helpful when I have a specific loan document to analyze.\n\nYou can upload a PDF or image of your loan agreement using the paperclip button, and then I can answer questions with precise references to your document.\n\nAlternatively, ask me about general microfinance topics — RBI guidelines, interest rate benchmarks, what to look for in a loan contract, etc.`;
      }
    }

    setMessages(prev => {
      const noTyping = prev.filter(m => !m.typing);
      return [...noTyping, { id: Date.now(), role: 'assistant', content: reply }];
    });
    setIsThinking(false);
  };

  return (
    <AppLayout>
      <Navbar title="AI Chat" subtitle="Ask anything about your loan document" />
      <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>

        {/* Sidebar: doc info */}
        <div style={{ width: 260, flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--bg-1)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Document
          </div>

          {uploadedFile ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '14px', borderRadius: 12, background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={18} color="var(--accent-cyan)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {uploadedFile.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
              {analysisContext && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Score', val: `${analysisContext.fairness?.score}/100` },
                    { label: 'Rate', val: `${analysisContext.analysis?.interest_rate ?? 'N/A'}%` },
                    { label: 'Risks', val: analysisContext.analysis?.risky_terms?.length ?? 0 },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <div style={{ padding: '20px 16px', borderRadius: 12, border: '1.5px dashed var(--border)', textAlign: 'center' }}>
              <FileText size={24} color="var(--text-tertiary)" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>No document uploaded yet</p>
            </div>
          )}

          <div className="divider" />

          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Quick Questions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {QUICK_QUESTIONS.map((q) => (
              <motion.button
                key={q}
                whileHover={{ x: 3 }}
                onClick={() => { setInput(q); inputRef.current?.focus(); }}
                style={{
                  padding: '9px 12px', borderRadius: 9,
                  background: 'var(--bg-glass)', border: '1px solid var(--border)',
                  cursor: 'pointer', textAlign: 'left',
                  fontSize: 12, color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {q}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {messages.map(msg => <ChatBubble key={msg.id} msg={msg} />)}
            <div ref={endRef} />
          </div>

          {/* Input bar */}
          <div style={{
            padding: '16px 24px 20px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-1)',
          }}>
            <div style={{
              borderRadius: 16,
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'flex-end', gap: 10,
              padding: '10px 14px',
              transition: 'border-color 0.2s',
            }}
              onFocus={() => {}}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            >
              {/* Upload button */}
              <label style={{ cursor: 'pointer', flexShrink: 0 }}>
                <input type="file" accept=".pdf,.png,.jpg,.jpeg" style={{ display: 'none' }}
                  onChange={e => e.target.files?.[0] && uploadDoc(e.target.files[0])} />
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: uploading ? 'rgba(0,212,255,0.15)' : 'var(--bg-glass)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: uploading ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  }}>
                  <Paperclip size={15} />
                </motion.div>
              </label>

              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask anything about your loan document..."
                rows={1}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  resize: 'none', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6,
                  fontFamily: 'var(--font-body)',
                  maxHeight: 120, overflowY: 'auto',
                }}
              />

              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || isThinking}
                whileHover={input.trim() ? { scale: 1.05 } : {}}
                whileTap={input.trim() ? { scale: 0.95 } : {}}
                style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: input.trim() ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))' : 'var(--bg-glass)',
                  border: input.trim() ? 'none' : '1px solid var(--border)',
                  cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: input.trim() ? '#fff' : 'var(--text-tertiary)',
                  transition: 'all 0.2s',
                  boxShadow: input.trim() ? '0 0 15px rgba(0,212,255,0.3)' : 'none',
                }}
              >
                <Send size={15} />
              </motion.button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, paddingLeft: 4 }}>
              <Sparkles size={11} color="var(--accent-cyan)" />
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                Powered by Gemini 2.5 Flash · RBI Knowledge Base
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
