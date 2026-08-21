import React from 'react';

export function Checkbox({ label, description, checked = false, onChange, disabled = false, style, ...rest }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <label
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}
    >
      <input type="checkbox" checked={checked} disabled={disabled}
        onChange={e => onChange && onChange(e.target.checked, e)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} {...rest} />
      <span style={{
        width: 18, height: 18, flexShrink: 0, marginTop: 2,
        border: '1px solid ' + (checked ? 'var(--champagne-gold)' : hovered ? 'var(--aged-brass)' : 'var(--line-structural)'),
        background: checked ? 'var(--champagne-gold)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'var(--transition-control)'
      }}>
        {checked && <span style={{ width: 9, height: 5, borderLeft: '1.5px solid var(--vertex-black)', borderBottom: '1.5px solid var(--vertex-black)', transform: 'rotate(-45deg) translate(1px,-1px)' }} />}
      </span>
      <span>
        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--size-body-sm)', color: 'var(--paper-white)', lineHeight: 1.45 }}>{label}</span>
        {description && <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--size-body-sm)', color: 'var(--text-tertiary)', marginTop: 2 }}>{description}</span>}
      </span>
    </label>
  );
}
