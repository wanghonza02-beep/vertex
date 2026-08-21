import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Toast({ open = true, message, tone = 'neutral', icon, onDismiss, style }) {
  React.useEffect(() => {
    if (!open || !onDismiss) return;
    const t = setTimeout(onDismiss, 4200);
    return () => clearTimeout(t);
  }, [open, onDismiss]);
  if (!open) return null;
  const accent = tone === 'alert' ? 'var(--corsa-red)' : tone === 'success' ? 'var(--champagne-gold)' : 'var(--line-structural)';
  return (
    <div role="status" style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)',
      background: 'var(--surface-raised)', border: '1px solid var(--line-structural)',
      borderLeft: '2px solid ' + accent, padding: 'var(--space-4) var(--space-5)',
      boxShadow: 'var(--shadow-lift)', ...style
    }}>
      {icon && <Icon name={icon} size={16} color={accent} />}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--paper-white)' }}>{message}</span>
      {onDismiss && <button onClick={onDismiss} aria-label="Dismiss" style={{ background: 'none', border: 0, color: 'var(--paper-dim)', cursor: 'pointer', marginLeft: 'var(--space-3)', padding: 0 }}><Icon name="x" size={14} /></button>}
    </div>
  );
}
