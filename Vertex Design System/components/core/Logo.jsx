import React from 'react';

const MARK = (goldFill, paperFill) => (
  <React.Fragment>
    <polygon points="50,8 92,88 54,88 50,52" fill={goldFill} />
    <polygon points="50,8 8,88 46,88 50,52" fill={paperFill} />
  </React.Fragment>
);

export function Logo({ variant = 'lockup', size = 40, mono, style, ...rest }) {
  const gold = mono === 'gold' ? 'var(--champagne-gold)' : mono === 'paper' ? 'var(--paper-white)' : 'var(--champagne-gold)';
  const paper = mono === 'gold' ? 'rgba(201,166,107,0.55)' : mono === 'paper' ? 'rgba(237,232,221,0.55)' : 'var(--paper-white)';
  const mark = (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Vertex" style={{ display: 'block' }}>
      {MARK(gold, paper)}
    </svg>
  );
  if (variant === 'mark') return <span style={style} {...rest}>{mark}</span>;
  if (variant === 'badge') {
    const box = size * 2.6;
    return (
      <span style={{ width: box, height: box, borderRadius: 'var(--radius-pill)', border: '1px solid var(--champagne-gold)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }} {...rest}>
        <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Vertex">{MARK(gold, paper)}</svg>
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.55, ...style }} {...rest}>
      {mark}
      <span style={{ fontFamily: 'var(--font-luxury)', fontWeight: 'var(--weight-luxury)', fontSize: size * 0.9, letterSpacing: 'var(--tracking-wordmark)', color: mono === 'gold' ? 'var(--champagne-gold)' : 'var(--paper-white)', lineHeight: 1 }}>VERTEX</span>
    </span>
  );
}
