import React from 'react';

const labelStyle = {
  display: 'block', fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-mono)',
  fontSize: 'var(--size-label-sm)', letterSpacing: 'var(--tracking-label)',
  textTransform: 'uppercase', color: 'var(--text-label)', marginBottom: 'var(--space-3)'
};
const helpStyle = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)',
  letterSpacing: '0.06em', marginTop: 'var(--space-2)'
};

export function Select({ label, value, onChange, options = [], placeholder = 'Select…', help, error, disabled = false, required = false, id, style, ...rest }) {
  const [focused, setFocused] = React.useState(false);
  const autoId = React.useId ? React.useId() : 'vx-select';
  const fieldId = id || autoId;
  const line = error ? 'var(--corsa-red)' : focused ? 'var(--champagne-gold)' : 'var(--line-structural)';
  return (
    <div style={style}>
      {label && <label htmlFor={fieldId} style={labelStyle}>{label}{required && <span style={{ color: 'var(--champagne-gold)' }}> *</span>}</label>}
      <div style={{ position: 'relative' }}>
        <select
          id={fieldId} value={value} disabled={disabled} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', height: 'var(--control-height)', padding: '0 var(--space-10) 0 var(--space-4)',
            background: 'var(--surface-card)', border: '1px solid ' + line, borderRadius: 'var(--radius-none)',
            color: value ? 'var(--paper-white)' : 'var(--text-tertiary)',
            fontFamily: 'var(--font-body)', fontSize: 'var(--size-body)',
            appearance: 'none', outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'var(--transition-control)'
          }} {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map(o => {
            const val = typeof o === 'string' ? o : o.value;
            const lab = typeof o === 'string' ? o : o.label;
            return <option key={val} value={val} style={{ background: 'var(--graphite)' }}>{lab}</option>;
          })}
        </select>
        <span style={{
          position: 'absolute', right: 'var(--space-4)', top: '50%', width: 7, height: 7,
          borderRight: '1px solid var(--champagne-gold)', borderBottom: '1px solid var(--champagne-gold)',
          transform: 'translateY(-70%) rotate(45deg)', pointerEvents: 'none'
        }} />
      </div>
      {(help || error) && <div style={{ ...helpStyle, color: error ? 'var(--corsa-red)' : 'var(--text-tertiary)' }}>{error || help}</div>}
    </div>
  );
}
