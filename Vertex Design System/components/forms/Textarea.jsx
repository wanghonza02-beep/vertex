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

export function Textarea({ label, value, onChange, placeholder, rows = 5, help, error, disabled = false, required = false, id, style, ...rest }) {
  const [focused, setFocused] = React.useState(false);
  const autoId = React.useId ? React.useId() : 'vx-textarea';
  const fieldId = id || autoId;
  const line = error ? 'var(--corsa-red)' : focused ? 'var(--champagne-gold)' : 'var(--line-structural)';
  return (
    <div style={style}>
      {label && <label htmlFor={fieldId} style={labelStyle}>{label}{required && <span style={{ color: 'var(--champagne-gold)' }}> *</span>}</label>}
      <textarea
        id={fieldId} rows={rows} value={value} placeholder={placeholder} disabled={disabled}
        onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: 'var(--space-4)', background: 'var(--surface-card)',
          border: '1px solid ' + line, borderRadius: 'var(--radius-none)', color: 'var(--paper-white)',
          fontFamily: 'var(--font-body)', fontSize: 'var(--size-body)', lineHeight: 'var(--leading-body)',
          outline: 'none', resize: 'vertical', transition: 'var(--transition-control)'
        }} {...rest}
      />
      {(help || error) && <div style={{ ...helpStyle, color: error ? 'var(--corsa-red)' : 'var(--text-tertiary)' }}>{error || help}</div>}
    </div>
  );
}
