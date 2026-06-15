import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileSearch, MessageSquare, GitCompare,
  History, Settings, ChevronLeft, ChevronRight,
  ShieldCheck, Zap, FileText, Bell, HelpCircle
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', badge: null },
  { icon: FileSearch, label: 'Analyze', path: '/analyze', badge: 'AI' },
  { icon: MessageSquare, label: 'AI Chat', path: '/chat', badge: 'New' },
  { icon: GitCompare, label: 'Compare', path: '/compare', badge: null },
  { icon: History, label: 'History', path: '/history', badge: null },
  { icon: FileText, label: 'Reports', path: '/reports', badge: null },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { isDark } = useTheme();

  const isActive = (path) => location.pathname === path;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        background: isDark
          ? 'linear-gradient(180deg, #071021 0%, #050816 100%)'
          : 'linear-gradient(180deg, #FFFFFF 0%, #F5F7FF 100%)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top glow */}
      <div style={{
        position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
        width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 72,
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              width: 40, height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 20px rgba(0,212,255,0.4)',
            }}
          >
            <ShieldCheck size={22} color="#fff" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  TrustLend
                </div>
                <div style={{ fontSize: 10, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  AI Platform
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            collapsed={collapsed}
            active={isActive(item.path)}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: '10px', borderTop: '1px solid var(--border)' }}>
        {bottomItems.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            collapsed={collapsed}
            active={isActive(item.path)}
          />
        ))}

        {/* User avatar */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                margin: '8px 2px 0',
                padding: '10px 12px',
                borderRadius: 12,
                background: 'var(--bg-glass)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>U</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', truncate: true }}>User</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Free Plan</div>
              </div>
              <div style={{ marginLeft: 'auto', position: 'relative' }}>
                <Bell size={14} color="var(--text-secondary)" />
                <div style={{
                  position: 'absolute', top: -2, right: -2,
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--accent-cyan)',
                }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse toggle */}
      <motion.button
        onClick={() => setCollapsed(c => !c)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'absolute',
          top: 24,
          right: -14,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: isDark ? '#0A1128' : '#FFFFFF',
          border: '1px solid var(--border-strong)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          boxShadow: 'var(--shadow-card)',
          zIndex: 10,
        }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </motion.button>
    </motion.aside>
  );
}

function NavItem({ item, collapsed, active }) {
  const { icon: Icon, label, path, badge } = item;

  return (
    <Link to={path} style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: collapsed ? '10px 14px' : '10px 14px',
          borderRadius: 10,
          cursor: 'pointer',
          position: 'relative',
          background: active
            ? 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(124,92,255,0.12))'
            : 'transparent',
          border: active ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
          transition: 'all 0.2s ease',
          overflow: 'hidden',
        }}
        onMouseEnter={e => {
          if (!active) e.currentTarget.style.background = 'var(--bg-glass)';
        }}
        onMouseLeave={e => {
          if (!active) e.currentTarget.style.background = 'transparent';
        }}
      >
        {active && (
          <motion.div
            layoutId="sidebar-active"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,92,255,0.06))',
              borderRadius: 10,
            }}
          />
        )}

        <div style={{
          position: 'relative',
          color: active ? 'var(--accent-cyan)' : 'var(--text-secondary)',
          flexShrink: 0,
          transition: 'color 0.2s',
        }}>
          <Icon size={18} />
          {active && (
            <div style={{
              position: 'absolute', inset: -4,
              borderRadius: '50%',
              background: 'rgba(0,212,255,0.15)',
              filter: 'blur(4px)',
            }} />
          )}
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span style={{
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                transition: 'color 0.2s',
              }}>
                {label}
              </span>
              {badge && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  padding: '2px 7px',
                  borderRadius: 99,
                  background: badge === 'AI'
                    ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))'
                    : 'linear-gradient(135deg, var(--accent-mint), var(--accent-blue))',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {badge}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}
