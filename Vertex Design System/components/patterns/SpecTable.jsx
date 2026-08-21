import React from 'react';

export function SpecTable({ rows = [], columns = 1, style }) {
  return (
    <dl style={{
      margin: 0, display: 'grid',
      gridTemplateColumns: 'repeat(' + columns + ', minmax(0,1fr))',
      columnGap: 'var(--space-16)', borderTop: 'var(--border-rule)', ...style
    }}>
      {rows.map(r => (
        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-6)', padding: 'var(--space-4) 0', borderBottom: 'var(--border-faint)' }}>
          <dt style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-label)' }}>{r.label}</dt>
          <dd style={{ margin: 0, textAlign: 'right', fontFamily: r.numeric ? 'var(--font-numeric)' : 'var(--font-body)', fontWeight: r.numeric ? 'var(--weight-numeric)' : 'var(--weight-body)', fontSize: 'var(--size-body-sm)', color: r.accent ? 'var(--champagne-gold)' : 'var(--paper-white)', letterSpacing: r.numeric ? 'var(--tracking-numeric)' : 0 }}>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
