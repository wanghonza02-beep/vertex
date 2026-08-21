const { Button, IconButton, Icon, Tag, Badge, Card, Logo, HeadlineSplit, SpecNumber, Eyebrow, SectionTitle, BlueprintRule, MediaFrame, Input, Textarea, Select, Checkbox, RadioGroup, Switch, SiteHeader, SiteFooter, Tabs, Dialog, Toast, Tooltip, BuildCard, SpecTable, BeforeAfter, AcousticPlayer } = window.VertexDesignSystem_24ef46;

function Commission() {
  const [donor, setDonor] = React.useState('');
  const [kind, setKind] = React.useState('Commission');
  const [email, setEmail] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [error, setError] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [toast, setToast] = React.useState(false);

  const submit = () => {
    if (!email.includes('@')) { setError('Enter a valid address.'); return; }
    setError(''); setSent(true); setToast(true);
  };

  return (
    <section style={{ padding:'var(--space-16) var(--gutter-page-wide) var(--space-24)' }}>
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1.15fr)', gap:'var(--space-20)' }}>
        <div>
          <Eyebrow>Commission</Eyebrow>
          <HeadlineSplit size="display" luxury="One chassis." tech="One owner." style={{ margin:'var(--space-5) 0 var(--space-8)' }} />
          <p style={{ font:'var(--type-body-lg)', color:'var(--text-body)', maxWidth:'var(--measure-text)', margin:'0 0 var(--space-12)' }}>
            Select a base donor and describe the direction you have in mind. A commission takes 14 to 20 months from sourcing to delivery.
          </p>
          <BlueprintRule tick />
          <div style={{ display:'flex', gap:'var(--space-12)', marginTop:'var(--space-10)' }}>
            <SpecNumber value={2} label="Slots remaining, 2026" tone="gold" />
            <SpecNumber value="14–20" unit="mo" label="Build duration" />
          </div>
        </div>

        <Card surface="graphite" style={{ padding:'var(--space-10)' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-6)' }}>
            <RadioGroup label="Enquiry type" name="kind" value={kind} onChange={setKind} layout="row"
              options={['Available build','Commission','Private viewing']} />
            <BlueprintRule tone="faint" />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-5)' }}>
              <Input label="Full name" required placeholder="Your name" />
              <Input label="Email" type="email" required value={email} error={error}
                onChange={e => setEmail(e.target.value)} placeholder="name@domain.com" />
            </div>
            <Select label="Base donor" value={donor} onChange={e => setDonor(e.target.value)}
              options={['Porsche 911 (964)','Porsche 911 Targa (964)','Mercedes-Benz 280 SL','Lamborghini Jalpa','Sourcing advice required']} />
            <Textarea label="Aesthetic direction" rows={4}
              placeholder="Paint, leather, stitching, exhaust character, intended use…" />
            <Checkbox label="Add me to the build-slot register"
              description="Two emails a year, when a slot or finished build becomes available."
              checked={consent} onChange={setConsent} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'var(--space-4)', marginTop:'var(--space-2)' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'var(--size-label-sm)', letterSpacing:'var(--tracking-label)', textTransform:'uppercase', color:'var(--paper-dim)' }}>Response within 2 working days</span>
              <Button onClick={submit}>Request a build slot</Button>
            </div>
          </div>
        </Card>
      </div>

      {toast && <div style={{ position:'fixed', bottom:'var(--space-8)', left:'var(--space-8)', zIndex:80 }}>
        <Toast tone="success" icon="check" message="Enquiry sent" onDismiss={() => setToast(false)} />
      </div>}

      <Dialog open={sent} eyebrow="Build slot" title="Your request is registered." onClose={() => setSent(false)}
        footer={<Button size="sm" onClick={() => setSent(false)}>Close</Button>}>
        A member of the studio will be in contact within two working days to discuss donor availability and the 2026 queue.
      </Dialog>
    </section>
  );
}
Object.assign(window, { Commission });
