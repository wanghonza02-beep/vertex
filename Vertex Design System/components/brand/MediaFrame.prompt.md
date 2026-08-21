Every image on a Vertex surface goes in one of these — it enforces the square corners, the hairline and the protection scrim.

```jsx
<MediaFrame src="/photo.jpg" ratio="3 / 2" scrim
  overlay={<Tag tone="rare" dot>1 of 1</Tag>}
  caption="Project 01 — engine bay, post-assembly" />
<MediaFrame ratio="16 / 9" placeholderLabel="Cinematic hero loop" />
```

Vertex ships no stock photography. Leaving `src` off renders the blueprint placeholder — use it rather than sourcing an off-brand image.
