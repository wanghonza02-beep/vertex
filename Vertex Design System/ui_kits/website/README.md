# UI kit — Vertex website

Click-through recreation of the five surfaces defined in `uploads/vertex-brand-concept.md` §7. Open `index.html`.

| File | Surface |
|---|---|
| `Homepage.jsx` | Hero (§7A), philosophy + hero stats, Available Builds inventory with an "available only" filter, Legacy Archive teaser |
| `VehicleDetail.jsx` | §7B — project designation, four hero spec callouts, donor/build comparison slider, tabbed specification breakdown, Acoustic Experience player, gallery with thumbnails |
| `LegacyArchive.jsx` | §7C — totals, year filter, one ruled row per build |
| `Commission.jsx` | §7D — enquiry type, donor selector, aesthetic-direction brief, validation, confirmation dialog + toast |
| `Showroom.jsx` | §7E — appointment slot grid, contact fields, confirmation dialog |
| `App.jsx` | Shell: sticky header (translucent over the hero), routing, footer |
| `data.js` | Four fictional builds. Names, hours and figures are invented for the recreation — they are not real Vertex inventory. |

**Interactions that work:** navigate all five surfaces, open a build from the inventory grid or archive row, drag the before/after slider, switch spec tabs, page the gallery, play the acoustic waveform, filter to available builds, submit the commission form (email validation → dialog + toast), pick a showroom slot → confirm.

**Deliberately absent** — not specified in the source, so not invented: the 4K hero video (blueprint placeholder + scrim stands in), all photography, real pricing, checkout, account/login, search, and the 50+ frame gallery (five thumbnails stand in for it).

Every screen composes the authored primitives; no component is re-implemented locally.
