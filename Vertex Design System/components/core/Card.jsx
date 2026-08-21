import React from 'react';

export function Card({ children, surface = 'graphite', interactive = false, padded = true, onClick, style, ...rest }) {
  const [hovered, setHovered] = React.useState(false);
  const surfaces = {
    graphite: 'var(--surface-card)',
    black: 'var(--surface-page)',
    raised: 'var(--surface-raised)',
    transparent: 'transparent'
  };
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: surfaces[surface] || surfaces.graphite,
        border: '1px solid ' + (interactive && hovered ? 'var(--champagne-gold)' : 'var(--line-structural)'),
        borderRadius: 'var(--radius-none)',
        padding: padded ? 'var(--card-pad)' : 0,
        cursor: interactive ? 'pointer' : 'default',
        transition: 'border-color var(--duration-base) var(--ease-standard)',
        ...style
      }} {...rest}
    >{children}</div>
  );
}
