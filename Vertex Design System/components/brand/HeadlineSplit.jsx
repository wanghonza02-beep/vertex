import React from 'react';

/** The two-font headline: a luxury (Italiana) clause handing off to a tech (Orbitron) clause. */
export function HeadlineSplit({ luxury, tech, size = 'display', align = 'left', style, ...rest }) {
  const scale = {
    hero: { l: 'var(--size-hero-luxury)', t: 'var(--size-hero-tech)' },
    display: { l: 'var(--size-display-luxury)', t: 'var(--size-display-tech)' },
    section: { l: 'var(--size-headline)', t: '30px' }
  }[size] || { l: 'var(--size-display-luxury)', t: 'var(--size-display-tech)' };

  return (
    <h1 style={{ margin: 0, textAlign: align, ...style }} {...rest}>
      {luxury && <span style={{
        display: 'block', fontFamily: 'var(--font-luxury)', fontWeight: 'var(--weight-luxury)',
        fontSize: scale.l, lineHeight: 'var(--leading-display)', letterSpacing: 'var(--tracking-luxury)',
        color: 'var(--paper-white)'
      }}>{luxury}</span>}
      {tech && <span style={{
        display: 'block', fontFamily: 'var(--font-tech)', fontWeight: 'var(--weight-tech)',
        fontSize: scale.t, lineHeight: 'var(--leading-tech)', letterSpacing: 'var(--tracking-tech)',
        textTransform: 'uppercase', color: 'var(--champagne-gold)', marginTop: 'var(--space-2)'
      }}>{tech}</span>}
    </h1>
  );
}
