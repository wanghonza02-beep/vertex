import React from 'react';

const base = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)',
  fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-mono)', letterSpacing: 'var(--tracking-cta)',
  textTransform: 'uppercase', borderRadius: 'var(--radius-none)', cursor: 'pointer',
  transition: 'var(--transition-control)', whiteSpace: 'nowrap', textDecoration: 'none',
  border: '1px solid transparent', background: 'none'
};

const sizes = {
  sm: { fontSize: 'var(--size-label-sm)', padding: '10px 18px', minHeight: 'var(--control-height-sm)' },
  md: { fontSize: 'var(--size-label)', padding: 'var(--control-pad-y) var(--control-pad-x)', minHeight: 'var(--control-height)' },
  lg: { fontSize: 'var(--size-body-sm)', padding: '18px 40px', minHeight: '58px' }
};

function variantStyle(variant, hovered, active) {
  switch (variant) {
    case 'secondary':
      return {
        color: hovered ? 'var(--champagne-gold)' : 'var(--action-secondary-fg)',
        borderColor: hovered ? 'var(--action-secondary-line-hover)' : 'var(--action-secondary-line)',
        background: active ? 'var(--gold-wash)' : 'transparent'
      };
    case 'ghost':
      return {
        color: hovered ? 'var(--paper-white)' : 'var(--action-ghost-fg)',
        borderColor: 'transparent', background: 'transparent',
        paddingLeft: 0, paddingRight: 0
      };
    case 'alert':
      return {
        color: hovered ? 'var(--paper-white)' : 'var(--corsa-red)',
        borderColor: 'var(--corsa-red)',
        background: hovered ? 'var(--corsa-red)' : 'transparent'
      };
    default:
      return {
        color: 'var(--action-primary-fg)',
        background: hovered ? 'var(--action-primary-bg-hover)' : 'var(--action-primary-bg)',
        borderColor: hovered ? 'var(--action-primary-bg-hover)' : 'var(--action-primary-bg)'
      };
  }
}

export function Button({
  children, variant = 'primary', size = 'md', disabled = false, href,
  iconLeft, iconRight, fullWidth = false, onClick, style, ...rest
}) {
  const [hovered, setHovered] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const disabledStyle = {
    color: 'var(--action-disabled-fg)', background: variant === 'primary' ? 'var(--action-disabled-bg)' : 'transparent',
    borderColor: variant === 'primary' ? 'var(--action-disabled-bg)' : 'var(--line-faint)', cursor: 'not-allowed'
  };
  const composed = {
    ...base, ...sizes[size] || sizes.md,
    ...(disabled ? disabledStyle : variantStyle(variant, hovered, active)),
    width: fullWidth ? '100%' : undefined,
    transform: active && !disabled ? 'translateY(1px)' : 'none',
    ...style
  };
  const Tag = href && !disabled ? 'a' : 'button';
  return (
    <Tag
      href={href} style={composed} disabled={Tag === 'button' ? disabled : undefined}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setActive(false); }}
      onMouseDown={() => setActive(true)} onMouseUp={() => setActive(false)}
      onClick={disabled ? undefined : onClick} {...rest}
    >
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </Tag>
  );
}
