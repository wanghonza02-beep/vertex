import React from 'react';

export function SectionTitle({ children, meta, style, ...rest }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-6)',
      borderBottom: 'var(--border-rule)', paddingBottom: 'var(--space-4)',
      margin: '0 0 var(--space-6)', ...style
    }} {...rest}>
      <h2 style={{
        margin: 0, fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-mono)',
        fontSize: 'var(--size-label)', letterSpacing: 'var(--tracking-eyebrow)',
        textTransform: 'uppercase', color: 'var(--champagne-gold)'
      }}>{children}</h2>
      {meta && <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)',
        letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-label)'
      }}>{meta}</span>}
    </div>
  );
}
