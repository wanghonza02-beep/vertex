import React from 'react';
import { Logo } from '../core/Logo.jsx';
import { Button } from '../core/Button.jsx';

export function SiteHeader({ items = [], active, onNavigate, cta = 'Request a build slot', onCta, transparent = false, style }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 'var(--space-10)', padding: '0 var(--gutter-page)', height: 78,
      background: transparent ? 'rgba(11,12,14,0.55)' : 'var(--surface-page)',
      backdropFilter: transparent ? 'blur(14px)' : undefined,
      borderBottom: 'var(--border-rule)', ...style
    }}>
      <a href="#" onClick={e => { e.preventDefault(); onNavigate && onNavigate(items[0] && (items[0].value || items[0])); }} style={{ borderBottom: 0 }}>
        <Logo variant="lockup" size={22} />
      </a>
      <nav style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center' }}>
        {items.map(it => {
          const val = typeof it === 'string' ? it : it.value;
          const lab = typeof it === 'string' ? it : it.label;
          const on = active === val;
          return (
            <a key={val} href="#" onClick={e => { e.preventDefault(); onNavigate && onNavigate(val); }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--size-label-sm)', letterSpacing: 'var(--tracking-label)',
                textTransform: 'uppercase', color: on ? 'var(--champagne-gold)' : 'var(--paper-muted)',
                borderBottom: '1px solid ' + (on ? 'var(--champagne-gold)' : 'transparent'), paddingBottom: 3
              }}>{lab}</a>
          );
        })}
      </nav>
      <Button size="sm" variant="secondary" onClick={onCta}>{cta}</Button>
    </header>
  );
}
