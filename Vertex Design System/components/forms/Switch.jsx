import React from 'react';

export function Switch({ label, checked = false, onChange, disabled = false, style }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}>
      <input type="checkbox" role="switch" checked={checked} disabled={disabled}
        onChange={e => onChange && onChange(e.target.checked, e)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={{
        width: 44, height: 20, flexShrink: 0, position: 'relative',
        border: '1px solid ' + (checked ? 'var(--champagne-gold)' : 'var(--line-structural)'),
        background: checked ? 'var(--gold-wash)' : 'transparent',
        transition: 'var(--transition-control)'
      }}>
        <span style={{
          position: 'absolute', top: 2, left: checked ? 24 : 2, width: 16, height: 14,
          background: checked ? 'var(--champagne-gold)' : 'var(--paper-dim)',
          transition: 'left var(--duration-base) var(--ease-out-technical), background-color var(--duration-fast) var(--ease-standard)'
        }} />
      </span>
      {label && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: checked ? 'var(--paper-white)' : 'var(--paper-muted)' }}>{label}</span>}
    </label>
  );
}
