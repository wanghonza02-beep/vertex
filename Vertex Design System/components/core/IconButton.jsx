import React from 'react';
import { Icon } from './Icon.jsx';

export function IconButton({ name, label, size = 'md', variant = 'outline', onClick, disabled = false, style, ...rest }) {
  const [hovered, setHovered] = React.useState(false);
  const box = size === 'sm' ? 34 : size === 'lg' ? 56 : 44;
  const glyph = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;
  const outline = variant === 'outline';
  return (
    <button
      aria-label={label} onClick={disabled ? undefined : onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: box, height: box, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-none)', cursor: disabled ? 'not-allowed' : 'pointer',
        background: variant === 'solid' ? (hovered ? 'var(--aged-brass)' : 'var(--champagne-gold)') : 'transparent',
        border: outline ? '1px solid ' + (hovered ? 'var(--champagne-gold)' : 'var(--line-structural)') : '1px solid transparent',
        color: disabled ? 'var(--action-disabled-fg)' : variant === 'solid' ? 'var(--vertex-black)' : hovered ? 'var(--champagne-gold)' : 'var(--paper-muted)',
        transition: 'var(--transition-control)', ...style
      }} {...rest}
    >
      <Icon name={name} size={glyph} />
    </button>
  );
}
