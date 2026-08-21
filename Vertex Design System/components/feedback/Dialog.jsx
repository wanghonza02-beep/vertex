import React from 'react';
import { IconButton } from '../core/IconButton.jsx';

export function Dialog({ open, title, eyebrow, children, footer, onClose, width = 560 }) {
  React.useEffect(() => {
    if (!open) return;
    const esc = e => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true"
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--surface-scrim)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: width, background: 'var(--surface-card)',
        border: '1px solid var(--line-structural)', boxShadow: 'var(--shadow-overlay)', borderRadius: 'var(--radius-none)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-6)', padding: 'var(--space-8) var(--space-8) var(--space-6)', borderBottom: 'var(--border-faint)' }}>
          <div>
            {eyebrow && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--champagne-gold)', marginBottom: 'var(--space-3)' }}>{eyebrow}</div>}
            <h2 style={{ margin: 0, fontFamily: 'var(--font-luxury)', fontWeight: 'var(--weight-luxury)', fontSize: 'var(--size-title)', color: 'var(--paper-white)', lineHeight: 'var(--leading-title)' }}>{title}</h2>
          </div>
          <IconButton name="x" label="Close" variant="ghost" size="sm" onClick={onClose} />
        </div>
        <div style={{ padding: 'var(--space-8)', font: 'var(--type-body)', color: 'var(--text-body)' }}>{children}</div>
        {footer && <div style={{ padding: 'var(--space-6) var(--space-8)', borderTop: 'var(--border-faint)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>{footer}</div>}
      </div>
    </div>
  );
}
