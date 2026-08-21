import React from 'react';

export function Badge({ children, tone = 'gold', style, ...rest }) {
  const tones = {
    gold: { color: 'var(--vertex-black)', background: 'var(--champagne-gold)' },
    rare: { color: 'var(--paper-white)', background: 'var(--corsa-red)' },
    dark: { color: 'var(--paper-white)', background: 'var(--graphite)' },
    paper: { color: 'var(--vertex-black)', background: 'var(--paper-white)' }
  };
  return (
    <span style={{
      display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '10px',
      fontWeight: 'var(--weight-body-semi)', letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase', padding: '5px 9px', borderRadius: 'var(--radius-none)',
      lineHeight: 1, ...(tones[tone] || tones.gold), ...style
    }} {...rest}>{children}</span>
  );
}
