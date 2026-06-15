import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, X, Loader2, CheckCircle, Scan } from 'lucide-react';

export default function FileUpload({ onFileSelect, isLoading, label = '', accept = '.pdf,.png,.jpg,.jpeg' }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputId = `file-${label.replace(/\s/g, '-') || Math.random().toString(36).substr(2, 5)}`;

  const handleDrag = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const handleFile = (file) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !isLoading && document.getElementById(inputId).click()}
      style={{
        position: 'relative',
        borderRadius: 20,
        border: `1.5px dashed ${dragActive ? 'var(--accent-cyan)' : isLoading ? 'var(--accent-purple)' : 'var(--border-strong)'}`,
        padding: '40px 32px',
        textAlign: 'center',
        cursor: isLoading ? 'default' : 'pointer',
        transition: 'all 0.3s ease',
        background: dragActive
          ? 'rgba(0,212,255,0.04)'
          : isLoading
          ? 'rgba(124,92,255,0.04)'
          : 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}
    >
      <input
        type="file"
        id={inputId}
        style={{ display: 'none' }}
        accept={accept}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* Corner decorations */}
      {['-top-left', '-top-right', '-bottom-left', '-bottom-right'].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...(pos.includes('top') ? { top: 12 } : { bottom: 12 }),
          ...(pos.includes('left') ? { left: 12 } : { right: 12 }),
          width: 12, height: 12,
          borderTop: pos.includes('top') ? '2px solid var(--accent-cyan)' : 'none',
          borderBottom: pos.includes('bottom') ? '2px solid var(--accent-cyan)' : 'none',
          borderLeft: pos.includes('left') ? '2px solid var(--accent-cyan)' : 'none',
          borderRight: pos.includes('right') ? '2px solid var(--accent-cyan)' : 'none',
          opacity: dragActive ? 1 : 0.3,
          transition: 'opacity 0.3s',
        }} />
      ))}

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
          >
            {/* Scanning animation */}
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', inset: 0,
                  borderRadius: '50%',
                  border: '2px solid transparent',
                  borderTop: '2px solid var(--accent-cyan)',
                  borderRight: '2px solid var(--accent-purple)',
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', inset: 8,
                  borderRadius: '50%',
                  border: '1.5px solid transparent',
                  borderBottom: '1.5px solid var(--accent-mint)',
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Scan size={28} color="var(--accent-cyan)" />
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                AI Scanning Document
              </div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ fontSize: 12, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}
              >
                Extracting clauses... analyzing risks...
              </motion.div>
            </div>
            {/* Progress bar */}
            <div style={{ width: '100%', maxWidth: 280, height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
              <motion.div
                animate={{ width: ['0%', '40%', '70%', '90%', '95%'] }}
                transition={{ duration: 4, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))', borderRadius: 99 }}
              />
            </div>
          </motion.div>
        ) : selectedFile ? (
          <motion.div
            key="selected"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                width: 60, height: 60,
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,92,255,0.15))',
                border: '1px solid rgba(0,212,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <FileText size={28} color="var(--accent-cyan)" />
            </motion.div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>
                {selectedFile.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontSize: 13, fontWeight: 600 }}>
              <CheckCircle size={14} /> Ready to analyze
            </div>
            <button
              onClick={removeFile}
              style={{
                padding: '6px 16px',
                borderRadius: 99,
                background: 'rgba(255,77,109,0.1)',
                border: '1px solid rgba(255,77,109,0.2)',
                color: 'var(--danger)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <X size={12} /> Remove
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
          >
            <motion.div
              animate={dragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                width: 64, height: 64,
                borderRadius: 18,
                background: dragActive
                  ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,92,255,0.2))'
                  : 'var(--bg-glass)',
                border: `1px solid ${dragActive ? 'rgba(0,212,255,0.4)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.3s, border 0.3s',
              }}
            >
              <UploadCloud size={28} color={dragActive ? 'var(--accent-cyan)' : 'var(--text-secondary)'} />
            </motion.div>

            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                {label || 'Drop your loan document here'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                or{' '}
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>browse files</span>
              </div>
            </div>

            <div style={{
              display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
            }}>
              {['PDF', 'PNG', 'JPG', 'JPEG'].map(ext => (
                <span key={ext} style={{
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border)',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.05em',
                }}>
                  .{ext.toLowerCase()}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              Max 16 MB
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
