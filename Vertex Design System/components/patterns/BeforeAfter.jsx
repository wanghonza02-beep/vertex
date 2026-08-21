import React from 'react';

/** Interactive donor → finished-build comparison slider. */
export function BeforeAfter({ before, after, beforeLabel = 'Donor', afterLabel = 'Vertex build', ratio = '16 / 9', style }) {
  const [pos, setPos] = React.useState(50);
  const ref = React.useRef(null);
  const drag = React.useRef(false);

  const move = (clientX) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  React.useEffect(() => {
    const up = () => { drag.current = false; };
    const mv = e => { if (drag.current) move(e.clientX ?? (e.touches && e.touches[0].clientX)); };
    window.addEventListener('pointerup', up);
    window.addEventListener('pointermove', mv);
    return () => { window.removeEventListener('pointerup', up); window.removeEventListener('pointermove', mv); };
  }, []);

  const Panel = ({ src, label, placeholder }) => (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-page)', backgroundImage: src ? 'url(' + src + ')' : 'var(--grid-blueprint)', backgroundSize: src ? 'cover' : 'auto', backgroundPosition: 'center' }}>
      {!src && <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--paper-dim)' }}>{placeholder}</span>}
    </div>
  );

  return (
    <div ref={ref} onPointerDown={e => { drag.current = true; move(e.clientX); }}
      style={{ position: 'relative', aspectRatio: ratio, overflow: 'hidden', border: '1px solid var(--line-structural)', cursor: 'ew-resize', userSelect: 'none', ...style }}>
      <Panel src={after} placeholder="Finished build" />
      <div style={{ position: 'absolute', inset: 0, clipPath: 'inset(0 ' + (100 - pos) + '% 0 0)' }}>
        <Panel src={before} placeholder="Donor chassis" />
      </div>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: pos + '%', width: 1, background: 'var(--champagne-gold)' }}>
        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 30, height: 30, border: '1px solid var(--champagne-gold)', background: 'var(--surface-scrim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <span style={{ width: 1, height: 10, background: 'var(--champagne-gold)' }} />
          <span style={{ width: 1, height: 10, background: 'var(--champagne-gold)' }} />
        </span>
      </div>
      <Label side="left">{beforeLabel}</Label>
      <Label side="right">{afterLabel}</Label>
    </div>
  );
}

function Label({ side, children }) {
  return (
    <span style={{
      position: 'absolute', bottom: 'var(--space-4)', [side]: 'var(--space-4)',
      fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase', color: 'var(--paper-white)', background: 'rgba(11,12,14,0.7)',
      border: '1px solid var(--line-structural)', padding: '5px 9px'
    }}>{children}</span>
  );
}
