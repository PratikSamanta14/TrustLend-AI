import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Search, Zap } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function Navbar({ title = '', subtitle = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        borderBottom: '1px solid var(--border)',
        background: isDark ? 'rgba(5,8,22,0.8)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: title */}
      <div>
        {title && (
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{subtitle}</p>
        )}
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* AI Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 99,
          background: 'rgba(0,255,200,0.08)',
          border: '1px solid rgba(0,255,200,0.2)',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--success)',
          fontFamily: 'var(--font-mono)',
        }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }}
          />
          AI READY
        </div>

        {/* Search */}
        <NavIconBtn onClick={() => {}}>
          <Search size={17} />
        </NavIconBtn>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <NavIconBtn>
            <Bell size={17} />
          </NavIconBtn>
          <div style={{
            position: 'absolute', top: 6, right: 6,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--accent-cyan)',
            border: '1.5px solid var(--bg-0)',
          }} />
        </div>

        {/* Theme toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: 'var(--bg-glass)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{ rotate: isDark ? 0 : 180, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </motion.div>
        </motion.button>
      </div>
    </motion.header>
  );
}

function NavIconBtn({ children, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        width: 36, height: 36,
        borderRadius: 10,
        background: 'var(--bg-glass)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-secondary)',
      }}
    >
      {children}
    </motion.button>
  );
}
