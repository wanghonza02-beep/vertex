import React from 'react';

/** The signature Vertex element: an oversized spec number drawn as a dimension callout. */
export function SpecNumber({
  value, unit, label, size = 'md', tone = 'paper', leader = 'left',
  countUp = false, style, ...rest
}) {
  const sizes = { sm: 'var(--size-spec-sm)', md: 'var(--size-spec)', lg: 'var(--size-spec-lg)', xl: 'var(--size-spec-xl)' };
  const [shown, setShown] = React.useState(countUp ? 0 : null);

  React.useEffect(() => {
    if (!countUp) return;
    const target = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (!isFinite(target)) return;
    const decimals = (String(value).split('.')[1] || '').length;
    const start = performance.now(), dur = 1200;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown((target * eased).toFixed(decimals));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, countUp]);

  const display = countUp && shown !== null ? shown : value;
  const vertical = leader === 'left';

  return (
    <div style={{
      position: 'relative',
      paddingLeft: vertical ? 'var(--space-6)' : 0,
      paddingTop: leader === 'top' ? 'var(--space-4)' : 0,
      ...style
    }} {...rest}>
      <span style={{
        position: 'absolute', background: 'var(--champagne-gold)',
        ...(vertical
          ? { left: 0, top: 6, bottom: 6, width: 1 }
          : leader === 'top' ? { left: 0, right: 0, top: 0, height: 1 } : { display: 'none' })
      }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <span style={{
          fontFamily: 'var(--font-numeric)', fontWeight: 'var(--weight-numeric)',
          fontSize: sizes[size] || sizes.md, letterSpacing: 'var(--tracking-numeric)',
          lineHeight: 'var(--leading-numeric)',
          color: tone === 'gold' ? 'var(--champagne-gold)' : tone === 'dim' ? 'var(--paper-dim)' : 'var(--paper-white)',
          fontVariantNumeric: 'tabular-nums'
        }}>{display}</span>
        {unit && <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label)', letterSpacing: 'var(--tracking-label)',
          textTransform: 'uppercase', color: 'var(--aged-brass)'
        }}>{unit}</span>}
      </div>
      {label && <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)', fontWeight: 'var(--weight-mono)',
        letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase',
        color: 'var(--text-label)', marginTop: 'var(--space-2)'
      }}>{label}</div>}
    </div>
  );
}
