const { Button, IconButton, Icon, Tag, Badge, Card, Logo, HeadlineSplit, SpecNumber, Eyebrow, SectionTitle, BlueprintRule, MediaFrame, Input, Textarea, Select, Checkbox, RadioGroup, Switch, SiteHeader, SiteFooter, Tabs, Dialog, Toast, Tooltip, BuildCard, SpecTable, BeforeAfter, AcousticPlayer } = window.VertexDesignSystem_24ef46;
const { Homepage, VehicleDetail, LegacyArchive, Commission, Showroom } = window;

function App() {
  const data = window.VERTEX_DATA;
  const [page, setPage] = React.useState('home');
  const [build, setBuild] = React.useState(null);

  const openBuild = (b) => { setBuild(b); setPage('build'); window.scrollTo(0,0); };
  const go = (p) => { setPage(p); window.scrollTo(0,0); };

  const nav = [
    { value:'home', label:'Home' },
    { value:'archive', label:'Legacy archive' },
    { value:'commission', label:'Commission' },
    { value:'showroom', label:'Showroom' }
  ];

  return (
    <div style={{ maxWidth:'var(--measure-wide)', margin:'0 auto', borderLeft:'var(--border-rule)', borderRight:'var(--border-rule)', minHeight:'100vh' }}>
      <SiteHeader items={nav} active={page === 'build' ? 'home' : page} onNavigate={go}
        transparent={page === 'home'} onCta={() => go('commission')} />
      {page === 'home' && <Homepage builds={data.builds} onSelect={openBuild} onNavigate={go} />}
      {page === 'build' && build && <VehicleDetail build={build} onBack={() => go('home')} />}
      {page === 'archive' && <LegacyArchive builds={data.builds} onSelect={openBuild} />}
      {page === 'commission' && <Commission />}
      {page === 'showroom' && <Showroom />}
      <SiteFooter columns={data.footer} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
setTimeout(() => window.lucide && window.lucide.createIcons(), 150);
