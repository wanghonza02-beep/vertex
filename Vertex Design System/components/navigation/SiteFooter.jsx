import React from 'react';
import { Logo } from '../core/Logo.jsx';

export function SiteFooter({ columns = [], note = '© Vertex. All builds one of one.', style }) {
  return (
    <footer style={{ borderTop: 'var(--border-rule)', padding: 'var(--space-16) var(--gutter-page) var(--space-10)', ...style }}>
      <div style={{ display: 'flex', gap: 'var(--space-20)', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ maxWidth: 280 }}>
          <Logo variant="lockup" size={24} />
          <p style={{ font: 'var(--type-body)', fontSize: 'var(--size-body-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-5)' }}>
            Iconic chassis, rebuilt at the point where character meets engineering.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-16)', flexWrap: 'wrap' }}>
          {columns.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-label)', marginBottom: 'var(--space-4)' }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {col.links.map(l => <a key={l} href="#" onClick={e => e.preventDefault()} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--size-body-sm)', color: 'var(--paper-muted)' }}>{l}</a>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: 'var(--border-faint)', marginTop: 'var(--space-12)', paddingTop: 'var(--space-6)', fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--paper-dim)' }}>{note}</div>
    </footer>
  );
}
