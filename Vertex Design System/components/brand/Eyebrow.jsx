import React from 'react';

export function Eyebrow({ children, tone = 'gold', as = 'div', style, ...rest }) {
  const Tag = as;
  return (
    <Tag style={{
      fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-mono)',
      fontSize: 'var(--size-label-sm)', letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase', lineHeight: 'var(--leading-label)',
      color: tone === 'gold' ? 'var(--champagne-gold)' : tone === 'brass' ? 'var(--aged-brass)' : 'var(--paper-muted)',
      ...style
    }} {...rest}>{children}</Tag>
  );
}
