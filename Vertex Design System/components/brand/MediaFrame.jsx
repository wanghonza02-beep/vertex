import React from 'react';

/**
 * Image/video container. Vertex photography is full-bleed, cool-shadowed and never rounded.
 * With no src it renders a blueprint placeholder with crosshair registration marks.
 */
export function MediaFrame({ src, alt = '', ratio = '16 / 9', caption, overlay, scrim = false, placeholderLabel = 'Photography', style, ...rest }) {
  return (
    <figure style={{ margin: 0, ...style }} {...rest}>
      <div style={{
        position: 'relative', aspectRatio: ratio, overflow: 'hidden',
        background: src ? 'var(--graphite)' : 'var(--surface-page)',
        border: '1px solid var(--line-structural)'
      }}>
        {src
          ? <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : (
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--grid-blueprint)', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(46,59,71,0.7)' }} />
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(46,59,71,0.7)' }} />
              <span style={{
                position: 'relative', fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)',
                letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--paper-dim)',
                background: 'var(--surface-page)', padding: '6px 12px', border: '1px solid var(--line-faint)'
              }}>{placeholderLabel}</span>
            </div>
          )}
        {scrim && <div style={{ position: 'absolute', inset: 0, background: 'var(--scrim-bottom)', pointerEvents: 'none' }} />}
        {overlay && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'var(--space-6)' }}>{overlay}</div>}
      </div>
      {caption && <figcaption style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)', letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase', color: 'var(--text-label)', marginTop: 'var(--space-3)'
      }}>{caption}</figcaption>}
    </figure>
  );
}
