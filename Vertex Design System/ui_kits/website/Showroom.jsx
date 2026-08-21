const { Button, IconButton, Icon, Tag, Badge, Card, Logo, HeadlineSplit, SpecNumber, Eyebrow, SectionTitle, BlueprintRule, MediaFrame, Input, Textarea, Select, Checkbox, RadioGroup, Switch, SiteHeader, SiteFooter, Tabs, Dialog, Toast, Tooltip, BuildCard, SpecTable, BeforeAfter, AcousticPlayer } = window.VertexDesignSystem_24ef46;

function Showroom() {
  const [slot, setSlot] = React.useState(null);
  const [confirmed, setConfirmed] = React.useState(false);
  const slots = [
    { day:'Thu 12 Mar', time:'10:00' }, { day:'Thu 12 Mar', time:'14:00' },
    { day:'Fri 13 Mar', time:'11:00' }, { day:'Tue 17 Mar', time:'09:30' },
    { day:'Wed 18 Mar', time:'15:00' }, { day:'Fri 20 Mar', time:'13:00' }
  ];
  return (
    <section style={{ padding:'var(--space-16) var(--gutter-page-wide) var(--space-24)' }}>
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1.05fr) minmax(0,1fr)', gap:'var(--space-20)' }}>
        <div>
          <Eyebrow>Private showroom</Eyebrow>
          <HeadlineSplit size="display" luxury="By appointment only." style={{ margin:'var(--space-5) 0 var(--space-8)' }} />
          <p style={{ font:'var(--type-body-lg)', color:'var(--text-body)', maxWidth:'var(--measure-text)', margin:'0 0 var(--space-10)' }}>
            The studio is not open to the public. Viewings run for ninety minutes, one client at a time, with the workshop floor accessible.
          </p>
          <MediaFrame ratio="16 / 9" placeholderLabel="Studio floor" caption="Stuttgart — assembly bay 2" />
        </div>
        <div>
          <SectionTitle meta="Mar 2026">Select a slot</SectionTitle>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-3)' }}>
            {slots.map((s, i) => {
              const on = slot === i;
              return (
                <button key={i} onClick={() => setSlot(i)}
                  style={{ textAlign:'left', padding:'var(--space-5)', cursor:'pointer',
                    background: on ? 'var(--gold-wash)' : 'var(--surface-card)',
                    border:'1px solid ' + (on ? 'var(--champagne-gold)' : 'var(--line-structural)'),
                    transition:'var(--transition-control)' }}>
                  <span style={{ display:'block', fontFamily:'var(--font-mono)', fontSize:'var(--size-label-sm)', letterSpacing:'var(--tracking-label)', textTransform:'uppercase', color: on ? 'var(--champagne-gold)' : 'var(--text-label)' }}>{s.day}</span>
                  <span style={{ display:'block', fontFamily:'var(--font-numeric)', fontWeight:'var(--weight-numeric)', fontSize:'var(--size-spec-sm)', letterSpacing:'var(--tracking-numeric)', color:'var(--paper-white)', marginTop:6 }}>{s.time}</span>
                </button>
              );
            })}
          </div>
          <BlueprintRule style={{ margin:'var(--space-8) 0' }} />
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
            <Input label="Full name" required placeholder="Your name" />
            <Input label="Telephone" type="tel" help="Used only to confirm the appointment." />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'var(--space-4)' }}>
              <Tooltip label="Studio address sent on confirmation">
                <span style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', fontFamily:'var(--font-mono)', fontSize:'var(--size-label-sm)', letterSpacing:'var(--tracking-label)', textTransform:'uppercase', color:'var(--paper-dim)' }}>
                  <Icon name="map-pin" size={14} /> Stuttgart
                </span>
              </Tooltip>
              <Button disabled={slot === null} onClick={() => setConfirmed(true)}>Book the viewing</Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={confirmed} eyebrow="Private showroom" title="Confirm your appointment." onClose={() => setConfirmed(false)}
        footer={<React.Fragment>
          <Button size="sm" variant="ghost" onClick={() => setConfirmed(false)}>Cancel</Button>
          <Button size="sm" onClick={() => setConfirmed(false)}>Confirm</Button>
        </React.Fragment>}>
        {slot !== null && (slots[slot].day + ', ' + slots[slot].time + ' — Studio, Stuttgart. Ninety minutes, workshop floor included.')}
      </Dialog>
    </section>
  );
}
Object.assign(window, { Showroom });
