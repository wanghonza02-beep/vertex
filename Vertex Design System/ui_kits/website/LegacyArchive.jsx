const { Button, IconButton, Icon, Tag, Badge, Card, Logo, HeadlineSplit, SpecNumber, Eyebrow, SectionTitle, BlueprintRule, MediaFrame, Input, Textarea, Select, Checkbox, RadioGroup, Switch, SiteHeader, SiteFooter, Tabs, Dialog, Toast, Tooltip, BuildCard, SpecTable, BeforeAfter, AcousticPlayer } = window.VertexDesignSystem_24ef46;

function LegacyArchive({ builds, onSelect }) {
  const [year, setYear] = React.useState('All');
  const years = ['All','2024','2023','2022'];
  return (
    <section style={{ padding:'var(--space-16) var(--gutter-page-wide) var(--space-24)' }}>
      <Eyebrow tone="brass">The legacy archive</Eyebrow>
      <HeadlineSplit size="display" luxury="Proof, not promise." tech="Every hour logged." style={{ margin:'var(--space-5) 0 var(--space-10)' }} />
      <div style={{ display:'flex', gap:'var(--space-16)', paddingBottom:'var(--space-12)', borderBottom:'var(--border-rule)' }}>
        <SpecNumber value="4,603" label="Total hours invested" size="lg" tone="gold" countUp />
        <SpecNumber value={7} label="Donors sourced" size="lg" countUp />
        <SpecNumber value={4} label="Builds delivered" size="lg" countUp />
      </div>
      <Tabs items={years} value={year} onChange={setYear} style={{ margin:'var(--space-10) 0 var(--space-8)' }} />
      <div style={{ borderTop:'var(--border-rule)' }}>
        {builds.map(b => (
          <ArchiveRow key={b.id} build={b} onSelect={() => onSelect(b)} />
        ))}
      </div>
    </section>
  );
}

function ArchiveRow({ build, onSelect }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display:'grid', gridTemplateColumns:'150px minmax(0,1fr) 130px 130px 150px 40px', alignItems:'center', gap:'var(--space-6)',
        padding:'var(--space-6) 0', borderBottom:'var(--border-faint)', cursor:'pointer',
        background: hovered ? 'var(--surface-card)' : 'transparent', transition:'background-color var(--duration-fast) var(--ease-standard)' }}>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:'var(--size-label-sm)', letterSpacing:'var(--tracking-label)', textTransform:'uppercase', color:'var(--text-label)' }}>{build.code}</span>
      <span>
        <span style={{ display:'block', fontFamily:'var(--font-luxury)', fontSize:'var(--size-title)', color: hovered ? 'var(--champagne-gold)' : 'var(--paper-white)', transition:'var(--transition-control)' }}>{build.title}</span>
        <span style={{ display:'block', font:'var(--type-body)', fontSize:'var(--size-body-sm)', color:'var(--text-tertiary)', marginTop:2 }}>{build.year} {build.donorName}</span>
      </span>
      <span style={{ fontFamily:'var(--font-numeric)', fontWeight:'var(--weight-numeric)', fontSize:'var(--size-body-lg)', color:'var(--paper-white)' }}>{build.power}</span>
      <span style={{ fontFamily:'var(--font-numeric)', fontWeight:'var(--weight-numeric)', fontSize:'var(--size-body-lg)', color:'var(--paper-white)' }}>{build.hours} h</span>
      <span>{build.status === 'sold' ? <Tag tone="sold">Sold 2024</Tag> : build.status === 'rare' ? <Tag tone="rare" dot>1 of 1</Tag> : <Tag tone="gold">Available</Tag>}</span>
      <Icon name="arrow-up-right" size={16} color={hovered ? 'var(--champagne-gold)' : 'var(--paper-dim)'} />
    </div>
  );
}
Object.assign(window, { LegacyArchive });
