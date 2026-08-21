import React from 'react';

export function RadioGroup({ label, name, value, onChange, options = [], layout = 'stack', style }) {
  return (
    <div style={style}>
      {label && <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)', letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase', color: 'var(--text-label)', marginBottom: 'var(--space-3)'
      }}>{label}</div>}
      <div style={{ display: 'flex', flexDirection: layout === 'row' ? 'row' : 'column', gap: layout === 'row' ? 'var(--space-6)' : 'var(--space-3)', flexWrap: 'wrap' }}>
        {options.map(o => {
          const val = typeof o === 'string' ? o : o.value;
          const lab = typeof o === 'string' ? o : o.label;
          return <Radio key={val} name={name} label={lab} checked={value === val} onChange={() => onChange && onChange(val)} />;
        })}
      </div>
    </div>
  );
}

export function Radio({ label, name, checked = false, onChange, disabled = false, style }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}>
      <input type="radio" name={name} checked={checked} disabled={disabled} onChange={onChange}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={{
        width: 16, height: 16, flexShrink: 0, transform: 'rotate(45deg)',
        border: '1px solid ' + (checked ? 'var(--champagne-gold)' : 'var(--line-structural)'),
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition-control)'
      }}>
        {checked && <span style={{ width: 8, height: 8, background: 'var(--champagne-gold)' }} />}
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--size-body-sm)', color: 'var(--paper-white)' }}>{label}</span>
    </label>
  );
}
