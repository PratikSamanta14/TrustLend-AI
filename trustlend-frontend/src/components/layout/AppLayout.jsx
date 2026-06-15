import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-0)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <motion.main
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        {children}
      </motion.main>
    </div>
  );
}
