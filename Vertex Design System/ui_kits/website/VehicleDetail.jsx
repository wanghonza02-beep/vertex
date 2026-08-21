const { Button, IconButton, Icon, Tag, Badge, Card, Logo, HeadlineSplit, SpecNumber, Eyebrow, SectionTitle, BlueprintRule, MediaFrame, Input, Textarea, Select, Checkbox, RadioGroup, Switch, SiteHeader, SiteFooter, Tabs, Dialog, Toast, Tooltip, BuildCard, SpecTable, BeforeAfter, AcousticPlayer } = window.VertexDesignSystem_24ef46;

function VehicleDetail({ build, onBack }) {
  const [tab, setTab] = React.useState('Exterior');
  const [shot, setShot] = React.useState(0);
  const specs = {
    Exterior: [
      { label:'Paint', value:build.paint },
      { label:'Wheels', value:'17in Fuchs, refinished' },
      { label:'Lighting', value:'LED in original housings' },
      { label:'Aero', value:'Ducktail, period-correct profile' }
    ],
    Interior: [
      { label:'Leather', value:'Full-grain, hand-stitched' },
      { label:'Trim', value:'Exposed carbon, Alcantara headliner' },
      { label:'Gauges', value:'Bespoke dials, matched to paint' },
      { label:'Amenities', value:'Concealed audio, climate control' }
    ],
    Powertrain: [
      { label:'Engine', value:'3.6 flat-six, twin-plug' },
      { label:'Power output', value:build.power, numeric:true, accent:true },
      { label:'0–100 km/h', value:build.sprint + ' s', numeric:true },
      { label:'Exhaust', value:'Stainless, signature acoustic profile' },
      { label:'Suspension', value:'Fully adjustable coilover' },
      { label:'Brakes', value:'6-piston front, 4-piston rear' }
    ]
  };
  return (
    <React.Fragment>
      <section style={{ padding:'var(--space-12) var(--gutter-page-wide) var(--space-16)', borderBottom:'var(--border-rule)' }}>
        <button onClick={onBack} style={{ background:'none', border:0, padding:0, cursor:'pointer', display:'flex', alignItems:'center', gap:'var(--space-2)', fontFamily:'var(--font-mono)', fontSize:'var(--size-label-sm)', letterSpacing:'var(--tracking-label)', textTransform:'uppercase', color:'var(--paper-muted)', marginBottom:'var(--space-10)' }}>
          <Icon name="arrow-left" size={13} /> All builds
        </button>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'var(--space-10)', flexWrap:'wrap' }}>
          <div>
            <Eyebrow>{build.code} — {build.year} {build.donorName}</Eyebrow>
            <HeadlineSplit size="display" luxury={build.title + '.'} style={{ marginTop:'var(--space-5)' }} />
          </div>
          <div style={{ display:'flex', gap:'var(--space-3)', alignItems:'center' }}>
            {build.status === 'rare' && <Tag tone="rare" dot>1 of 1 — rare donor</Tag>}
            {build.status === 'sold' ? <Tag tone="sold">Sold 2024</Tag> : <Tag tone="gold">{build.price}</Tag>}
          </div>
        </div>
        <div style={{ display:'flex', gap:'var(--space-16)', marginTop:'var(--space-16)' }}>
          <SpecNumber value={parseInt(build.power)} unit="hp" label="Power output" size="lg" tone="gold" countUp />
          <SpecNumber value={build.sprint} unit="sec" label="0–100 km/h" size="lg" countUp />
          <SpecNumber value={build.year} label="Donor year" size="lg" />
          <SpecNumber value={build.hours} label="Hours invested" size="lg" />
        </div>
      </section>

      <section style={{ padding:'var(--space-20) var(--gutter-page-wide)', borderBottom:'var(--border-rule)' }}>
        <SectionTitle meta="Drag to compare">Donor to build</SectionTitle>
        <BeforeAfter ratio="21 / 9" beforeLabel="Donor, as acquired" afterLabel={build.title} />
      </section>

      <section style={{ padding:'var(--space-20) var(--gutter-page-wide)', borderBottom:'var(--border-rule)' }}>
        <SectionTitle meta="Full breakdown">Specification</SectionTitle>
        <Tabs items={['Exterior','Interior','Powertrain']} value={tab} onChange={setTab} style={{ marginBottom:'var(--space-8)' }} />
        <SpecTable columns={2} rows={specs[tab]} />
      </section>

      <section style={{ padding:'var(--space-20) var(--gutter-page-wide)', borderBottom:'var(--border-rule)', display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)', gap:'var(--space-16)' }}>
        <div>
          <SectionTitle>Acoustic experience</SectionTitle>
          <AcousticPlayer tracks={[{ label:'Cold start', duration:'0:34' }, { label:'Exhaust note', duration:'1:12' }]} />
          <p style={{ font:'var(--type-body)', fontSize:'var(--size-body-sm)', color:'var(--text-tertiary)', marginTop:'var(--space-5)' }}>
            Recorded at the studio, 4m from the tailpipe, no processing.
          </p>
        </div>
        <div>
          <SectionTitle meta="52 frames">Gallery</SectionTitle>
          <MediaFrame ratio="3 / 2" placeholderLabel={'Frame ' + String(shot + 1).padStart(2,'0')} scrim
            overlay={<div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <Badge tone="gold">{build.code}</Badge>
              <div style={{ display:'flex', gap:'var(--space-2)' }}>
                <IconButton name="chevron-left" label="Previous" size="sm" onClick={() => setShot(s => Math.max(0, s - 1))} />
                <IconButton name="chevron-right" label="Next" size="sm" onClick={() => setShot(s => Math.min(51, s + 1))} />
              </div>
            </div>} />
          <div style={{ display:'flex', gap:'var(--space-2)', marginTop:'var(--space-3)' }}>
            {[0,1,2,3,4].map(i => (
              <button key={i} onClick={() => setShot(i)} style={{ flex:1, height:52, background:'var(--surface-page)', backgroundImage:'var(--grid-blueprint)', border:'1px solid ' + (shot === i ? 'var(--champagne-gold)' : 'var(--line-structural)'), cursor:'pointer' }} />
            ))}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
Object.assign(window, { VehicleDetail });
