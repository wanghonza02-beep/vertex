import React from 'react';

export function BlueprintRule({ orientation = 'horizontal', tone = 'structural', tick = false, animate = false, length, style, ...rest }) {
  const color = tone === 'gold' ? 'var(--champagne-gold)' : tone === 'faint' ? 'var(--line-faint)' : 'var(--line-structural)';
  const horizontal = orientation === 'horizontal';
  const ref = React.useRef(null);
  const [drawn, setDrawn] = React.useState(!animate);

  React.useEffect(() => {
    if (!animate || !ref.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setDrawn(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [animate]);

  return (
    <div ref={ref} style={{ position: 'relative', display: horizontal ? 'block' : 'inline-block',
      width: horizontal ? (length || '100%') : 1, height: horizontal ? 1 : (length || '100%'),
      overflow: 'visible', ...style }} {...rest}>
      <span style={{
        position: 'absolute', inset: 0, background: color, transformOrigin: horizontal ? 'left center' : 'center top',
        transform: horizontal ? 'scaleX(' + (drawn ? 1 : 0) + ')' : 'scaleY(' + (drawn ? 1 : 0) + ')',
        transition: 'transform var(--duration-draw) var(--ease-draw)'
      }} />
      {tick && (
        <React.Fragment>
          <span style={{ position: 'absolute', background: color, ...(horizontal ? { left: 0, top: -4, width: 1, height: 9 } : { top: 0, left: -4, height: 1, width: 9 }) }} />
          <span style={{ position: 'absolute', background: color, ...(horizontal ? { right: 0, top: -4, width: 1, height: 9 } : { bottom: 0, left: -4, height: 1, width: 9 }) }} />
        </React.Fragment>
      )}
    </div>
  );
}
