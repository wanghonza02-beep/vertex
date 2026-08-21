import React from 'react';

export function Tabs({ items = [], value, onChange, style }) {
  return (
    <div role="tablist" style={{ display: 'flex', gap: 'var(--space-8)', borderBottom: 'var(--border-rule)', ...style }}>
      {items.map(it => {
        const val = typeof it === 'string' ? it : it.value;
        const lab = typeof it === 'string' ? it : it.label;
        const active = value === val;
        return (
          <button key={val} role="tab" aria-selected={active} onClick={() => onChange && onChange(val)}
            style={{
              background: 'none', border: 0, borderBottom: '1px solid ' + (active ? 'var(--champagne-gold)' : 'transparent'),
              padding: '0 0 var(--space-4)', marginBottom: -1, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-mono)', fontSize: 'var(--size-label-sm)',
              letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase',
              color: active ? 'var(--champagne-gold)' : 'var(--paper-muted)',
              transition: 'var(--transition-control)'
            }}>{lab}</button>
        );
      })}
    </div>
  );
}
