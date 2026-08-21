The complete specification breakdown on a vehicle detail page.

```jsx
<SpecTable columns={2} rows={[
  { label: 'Engine', value: '3.6 flat-six, twin-plug' },
  { label: 'Power output', value: '640 hp', numeric: true, accent: true },
  { label: 'Paint code', value: 'PTS Monaco Blue' }
]} />
```

Labels stay uppercase mono; values right-aligned. At most one `accent` row per table.
