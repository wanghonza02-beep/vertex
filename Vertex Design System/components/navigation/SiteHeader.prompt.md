Global navigation for vertex.com.

```jsx
<SiteHeader items={[{value:'home',label:'Home'},{value:'archive',label:'Legacy archive'}]}
  active={page} onNavigate={setPage} onCta={() => setPage('commission')} />
```

`transparent` is the only place Vertex uses backdrop blur — over the hero film, so the nav stays legible without a bar.
