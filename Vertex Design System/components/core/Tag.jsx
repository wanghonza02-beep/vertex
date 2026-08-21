import React from 'react';

export function Tag({ children, tone = 'neutral', dot = false, style, ...rest }) {
  const tones = {
    neutral: { color: 'var(--paper-muted)', borderColor: 'var(--line-structural)', background: 'transparent' },
    gold: { color: 'var(--champagne-gold)', borderColor: 'var(--champagne-gold)', background: 'transparent' },
    rare: { color: 'var(--corsa-red)', borderColor: 'var(--corsa-red)', background: 'transparent' },
    sold: { color: 'var(--paper-dim)', borderColor: 'var(--line-faint)', background: 'transparent' },
    solid: { color: 'var(--vertex-black)', borderColor: 'var(--champagne-gold)', background: 'var(--champagne-gold)' }
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
      fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)', fontWeight: 'var(--weight-mono)',
      letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase',
      padding: '9px 14px', border: '1px solid', borderRadius: 'var(--radius-none)', ...t, ...style
    }} {...rest}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 'var(--radius-pill)', background: 'currentColor' }} />}
      {children}
    </span>
  );
}
