import React from 'react';
import { MediaFrame } from '../brand/MediaFrame.jsx';
import { Tag } from '../core/Tag.jsx';
import { Eyebrow } from '../brand/Eyebrow.jsx';

export function BuildCard({ code, title, donor, status = 'available', hours, power, image, onSelect, style }) {
  const [hovered, setHovered] = React.useState(false);
  const statusTag = {
    available: <Tag tone="gold">Available</Tag>,
    rare: <Tag tone="rare" dot>1 of 1 — rare donor</Tag>,
    sold: <Tag tone="sold">Sold</Tag>,
    building: <Tag tone="neutral" dot>In build</Tag>
  }[status];
  return (
    <article
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        border: '1px solid ' + (hovered ? 'var(--champagne-gold)' : 'var(--line-structural)'),
        background: 'var(--surface-card)', cursor: onSelect ? 'pointer' : 'default',
        transition: 'border-color var(--duration-base) var(--ease-standard)', ...style
      }}>
      <MediaFrame src={image} ratio="3 / 2" placeholderLabel={code} style={{ margin: '-1px -1px 0' }} />
      <div style={{ padding: 'var(--card-pad)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
          <Eyebrow tone="brass">{code}</Eyebrow>
          {statusTag}
        </div>
        <h3 style={{
          margin: 'var(--space-4) 0 var(--space-2)', fontFamily: 'var(--font-luxury)',
          fontWeight: 'var(--weight-luxury)', fontSize: 'var(--size-title)', lineHeight: 'var(--leading-title)',
          color: hovered ? 'var(--champagne-gold)' : 'var(--paper-white)', transition: 'var(--transition-control)'
        }}>{title}</h3>
        {donor && <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 'var(--size-body-sm)', color: 'var(--text-tertiary)' }}>{donor}</p>}
        {(hours || power) && (
          <div style={{ display: 'flex', gap: 'var(--space-8)', marginTop: 'var(--space-6)', paddingTop: 'var(--space-5)', borderTop: 'var(--border-faint)' }}>
            {power && <Metric value={power} label="Power" />}
            {hours && <Metric value={hours} label="Hours" />}
          </div>
        )}
      </div>
    </article>
  );
}

function Metric({ value, label }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-numeric)', fontWeight: 'var(--weight-numeric)', fontSize: 'var(--size-body-lg)', letterSpacing: 'var(--tracking-numeric)', color: 'var(--paper-white)' }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-label)', marginTop: 3 }}>{label}</div>
    </div>
  );
}
