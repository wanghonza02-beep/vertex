import React from 'react';
import { Icon } from '../core/Icon.jsx';

/** "Acoustic Experience" player — cold start and exhaust note, drawn as a waveform readout. */
export function AcousticPlayer({ tracks = [], style }) {
  const [active, setActive] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress(p => (p >= 100 ? (setPlaying(false), 0) : p + 0.8)), 40);
    return () => clearInterval(id);
  }, [playing]);

  const bars = React.useMemo(() => Array.from({ length: 68 }, (_, i) => 18 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * 46), []);

  return (
    <div style={{ border: '1px solid var(--line-structural)', background: 'var(--surface-card)', padding: 'var(--card-pad)', ...style }}>
      <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        {tracks.map((t, i) => (
          <button key={t.label} onClick={() => { setActive(i); setProgress(0); setPlaying(true); }}
            style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)', letterSpacing: 'var(--tracking-label)',
              textTransform: 'uppercase', color: i === active ? 'var(--champagne-gold)' : 'var(--paper-dim)',
              borderBottom: '1px solid ' + (i === active ? 'var(--champagne-gold)' : 'transparent'), paddingBottom: 3 }}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        <button onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pause' : 'Play'}
          style={{ width: 48, height: 48, flexShrink: 0, background: 'var(--champagne-gold)', border: 0, color: 'var(--vertex-black)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={playing ? 'pause' : 'play'} size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 64, flex: 1 }}>
          {bars.map((h, i) => (
            <span key={i} style={{
              flex: 1, height: h + '%',
              background: (i / bars.length) * 100 <= progress ? 'var(--champagne-gold)' : 'var(--blueprint-line)',
              transition: 'background-color 80ms linear'
            }} />
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-numeric)', fontWeight: 'var(--weight-numeric)', fontSize: 'var(--size-body-sm)', color: 'var(--paper-muted)', minWidth: 44, textAlign: 'right' }}>
          {tracks[active] ? tracks[active].duration : '0:00'}
        </span>
      </div>
    </div>
  );
}
