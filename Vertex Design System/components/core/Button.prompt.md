Vertex's action control — use for every CTA, form submit and inline navigation action.

```jsx
<Button variant="primary" size="lg">View the build</Button>
<Button variant="secondary" iconRight={<Icon name="arrow-right" size={14} />}>Legacy archive</Button>
<Button variant="ghost" size="sm">Cancel</Button>
```

- **One gold `primary` per screen.** Everything else is `secondary` (blueprint outline) or `ghost`.
- `alert` (Corsa Red) is only for rare/limited signals — "Request the last build slot", never a generic destructive button.
- Corners are always square; hover darkens gold to Aged Brass; press nudges 1px down. No bounce, no scale.
