import React from 'react';

export function Tooltip({ label, children, placement = 'top', style }) {
  const [open, setOpen] = React.useState(false);
  const pos = {
    top: { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    right: { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' },
    left: { right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }
  }[placement];
  return (
    <span style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {children}
      {open && (
        <span role="tooltip" style={{
          position: 'absolute', ...pos, zIndex: 60, whiteSpace: 'nowrap',
          background: 'var(--paper-white)', color: 'var(--vertex-black)',
          fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: 'var(--tracking-label)',
          textTransform: 'uppercase', padding: '6px 10px', pointerEvents: 'none'
        }}>{label}</span>
      )}
    </span>
  );
}
