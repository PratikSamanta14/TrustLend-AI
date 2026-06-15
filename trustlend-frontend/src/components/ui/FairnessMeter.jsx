import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function getColor(score) {
  if (score >= 75) return 'var(--success)';
  if (score >= 45) return 'var(--warning)';
  return 'var(--danger)';
}

function getVerdict(score) {
  if (score >= 75) return 'Fair';
  if (score >= 45) return 'Needs Review';
  return 'Unfair';
}

// Full circular gauge
export default function FairnessMeter({ score = 0, compact = false, size = 180 }) {
  const [animScore, setAnimScore] = useState(0);
  const color = getColor(score);
  const verdict = getVerdict(score);

  useEffect(() => {
    const timer = setTimeout(() => setAnimScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  if (compact) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
            Fairness
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{score}</span>
        </div>
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              height: '100%',
              borderRadius: 99,
              background: `linear-gradient(90deg, ${color}, ${color}88)`,
              boxShadow: `0 0 8px ${color}80`,
            }}
          />
        </div>
        <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 4, textAlign: 'right' }}>{verdict}</div>
      </div>
    );
  }

  // Full gauge
  const cx = size / 2, cy = size / 2;
  const r = (size / 2) - 16;
  const stroke = 12;
  const circumference = 2 * Math.PI * r;
  const arcLength = circumference * 0.75; // 270 degree arc
  const dashOffset = arcLength - (arcLength * animScore / 100);
  const startAngle = 135;
  const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
  const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(0deg)' }}>
          {/* Outer glow ring */}
          <circle
            cx={cx} cy={cy} r={r + 6}
            fill="none"
            stroke={color}
            strokeWidth={1}
            opacity={0.1}
          />
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={0}
            style={{ transform: `rotate(135deg)`, transformOrigin: `${cx}px ${cy}px` }}
          />
          {/* Progress */}
          <motion.circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
            style={{
              transform: `rotate(135deg)`,
              transformOrigin: `${cx}px ${cy}px`,
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = 135 + (tick / 100) * 270;
            const rad = (angle * Math.PI) / 180;
            const inner = r - stroke / 2 - 4;
            const outer = r + stroke / 2 + 4;
            return (
              <line
                key={tick}
                x1={cx + inner * Math.cos(rad)}
                y1={cy + inner * Math.sin(rad)}
                x2={cx + outer * Math.cos(rad)}
                y2={cy + outer * Math.sin(rad)}
                stroke={color}
                strokeWidth={1.5}
                opacity={0.4}
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 2,
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: size * 0.22,
              fontWeight: 800,
              color,
              lineHeight: 1,
              textShadow: `0 0 30px ${color}60`,
            }}
          >
            {score}
          </motion.div>
          <div style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Score
          </div>
        </div>
      </div>

      {/* Verdict pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        style={{
          padding: '6px 20px',
          borderRadius: 99,
          background: `${color}15`,
          border: `1px solid ${color}30`,
          fontFamily: 'var(--font-display)',
          fontSize: 13,
          fontWeight: 700,
          color,
          letterSpacing: '0.04em',
          boxShadow: `0 0 20px ${color}20`,
        }}
      >
        {verdict}
      </motion.div>
    </div>
  );
}
