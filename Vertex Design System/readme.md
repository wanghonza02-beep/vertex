# Vertex — Design System

Vertex is a **restomod atelier**: it acquires rare classic donor cars (air-cooled Porsche 911s, classic Mercedes-Benz SL roadsters, vintage Lamborghinis), strips them to bare metal, and rebuilds them with modern powertrains, suspension, braking and bespoke hand-stitched interiors — 1,000+ hours per car, sold at ultra-premium bespoke price points. Every build is one of one: it is made from one specific piece of history and one owner's choices, so it physically cannot exist twice.

The brand lives at the *vertex* — the apex where two curves meet: the soul of a classic car and the performance of a modern one. Design work must hold that tension visibly: an editorial fashion-serif voice for heritage, a HUD/dashboard display face for engineering, and a technical-drawing substrate (hairlines, dimension callouts, blueprint grids) underneath everything.

## Sources

Everything in this system derives from two files the user supplied. There was no codebase, Figma file or repository.

| Source | What it gave us |
|---|---|
| `uploads/vertex-brand-concept.md` | Brand philosophy, mission, values, voice & tone, business model, full website architecture (§7), colour palette, typography, blueprint visual language, signature spec-number pattern, motion rules, logo direction |
| `uploads/vertex-design-preview-v3.html` | The only rendered artefact: logo mark + wordmark + badge lockups, hero headline construction, CTA and rare-tag styling, spec-number treatment, palette swatches, type specimens. **Exact values (66px Italiana, 52px Orbitron 900, 14px/28px CTA padding, `#B9B4A7` body grey) were copied from here, not rounded.** |

No fonts, photography, icon set or product screenshots were supplied. See **Substitutions & gaps** below.

---

## Products / surfaces

The brand concept defines **one product: the Vertex marketing website** (§7), with five surfaces:

1. **Homepage** — cinematic hero film, philosophy, Available Builds inventory, Legacy Archive teaser
2. **Vehicle Detail (Build Showcase)** — project designation, before/after donor slider, full spec breakdown, acoustic player, 50+ photo gallery
3. **The Legacy Archive** — catalogue of sold builds with man-hours and historical backstory
4. **Commission / Build Slot Request** — donor configurator + enquiry form
5. **Private Showroom & Contact** — VIP appointment booking

There is no app, dashboard, docs site or slide template in the source, so none were invented. All five surfaces are recreated in `ui_kits/website/` as one interactive click-through — see its `README.md` for what works and what is deliberately absent.

---

## Content fundamentals

**Register: quiet, expert, declarative.** Copy is written for someone already inside the world of classic and performance cars. It never explains, never sells hard, never gets excited.

- **Sentence shape.** Short declaratives, often two clauses with a full stop between them. *"We do not build cars. We resurrect legends."* / *"Immortal Icons. Modern Muscle."* Fragments are allowed and preferred over long sentences.
- **Person.** First-person plural for the studio (*"We take the most iconic chassis…"*), second person only when addressing the client's own decisions (*"your build slot"*, *"the direction you have in mind"*). Never "I". Never "our customers" — a Vertex buyer is a *client* or an *owner*.
- **Specificity replaces superlatives.** Write *"1,247 hours of hand-finishing"*, not *"the best in the world"*. Write *"3.6 flat-six, twin-plug"*, not *"a monster engine"*. If a claim can carry a number, it carries a number.
- **Banned:** exclamation marks, "amazing", "incredible", "game-changing", "revolutionary", "unlock", "elevate your…", "luxury" as a self-description, emoji (never, anywhere), ALL-CAPS shouting in body copy, and any sentence that could appear on a mass-market car brand's site.
- **Casing.** Body and headlines in sentence case. Labels, eyebrows, CTAs, tags and captions in UPPERCASE mono with tracking. Project codes are uppercase: `PROJECT 01 — 1989 PORSCHE 911`. Never Title Case Headlines.
- **Punctuation.** En dash with spaces for asides and between a code and its donor (`Project 01 — 1989 Porsche 911`); never a colon there. Number ranges use an en dash (`0–100 km/h`). Thousands separated with a comma (`1,247`).
- **CTAs are verbs, 2–4 words, uppercase mono:** "View the build", "Request a build slot", "Book a private viewing", "Enter the archive". Never "Learn more", "Get started", "Click here".
- **Tags and status are nouns, not sentences:** `AVAILABLE`, `1 OF 1 — FERRARI DONOR`, `SOLD 2024`, `IN BUILD`.
- **Toasts and system copy:** 2–4 words, uppercase, no full stop — `ENQUIRY SENT`, `SHORTLIST UPDATED`.
- **Scarcity is stated, never performed.** "Four build slots remain in 2026" is on-brand. "Hurry — selling fast!" is not.

Example paragraph in register:

> Every build begins with a rare donor chassis, stripped to bare metal and rebuilt using the finest modern engineering available today. Nothing about the silhouette is negotiable. Everything beneath it is.

---

## Visual foundations

### Colour
Seven base values only (`tokens/colors.css`). Vertex Black `#0B0C0E` is the page; Graphite `#1A1C1F` is every panel and card; Paper White `#EDE8DD` is a warm off-white that reads as old drawing paper — **pure `#FFF` is never used**. Body copy is Paper Muted `#B9B4A7`; captions and disabled states step down to `#7C786F`.

Champagne Gold `#C9A66B` is the single accent, and it is **rationed**: one gold element per screen region — a CTA, a headline stat, an active nav item, a focus ring. Aged Brass `#8C7248` is gold's hover/muted partner and the colour of small mono labels. Corsa Red `#C1272D` is rationed harder still — motion/scroll indicators, video-section hover, and rare/limited tags — never a background, never a base, never a second accent competing with gold. Blueprint Line `#2E3B47` does all structural work: dividers, borders, grid, dimension marks.

Everything else on screen is black, graphite or paper, precisely so gold and red keep their weight. There is no light mode; there are no tints beyond the wash values (`--gold-wash` 12%, `--gold-wash-strong` 22%, `--red-wash` 12%) used for pressed states.

### Typography
A deliberate **two-font display split** mirroring the brand's tension, plus three functional faces:

| Role | Face | Setting |
|---|---|---|
| Heritage / "soul" clause, wordmark | **Italiana** 400 | 66–96px display, 1.05–1.1 leading, +0.01em; wordmark +0.12em |
| Engineering / "modern" clause | **Orbitron** 900 | 52–74px, uppercase, +0.02em, always Champagne Gold |
| Body, subtitles, UI copy | **IBM Plex Sans** 400/500 | 16–19px, 1.6 leading, 560px measure |
| Labels, eyebrows, CTAs, captions, project codes | **IBM Plex Mono** 500 | 11–13px, uppercase, +0.12em / +0.15em |
| Oversized spec figures | **JetBrains Mono** 700 | 28–88px, −0.02em, tabular |

Hard rule: **never mix the luxury and tech faces inside one clause.** A headline reads as one Italiana clause, then hands off cleanly to one Orbitron clause. Orbitron never sets body copy or a section title; Italiana never sets a label. Section titles are mono, not display — display type is reserved for headlines and (uniquely) dialog titles.

### Layout & spacing
4px base unit. Editorial column 980px, product shell 1440px, paragraph measure 560px. Page gutter 40px (64px wide). 120px between major sections, 70px between sub-blocks, 28px card padding, 48px control height. Sections are separated by a **1px rule plus space**, not space alone — the rule is structural, the way a drawing sheet is ruled. Cards sit in tight grids (1px gaps or 32px gutters). The sticky header is 78px with a rule beneath it; it is the only fixed element.

### Shape, borders, elevation
**0px border-radius everywhere** — buttons, cards, inputs, images, tags, toggles. The only curves in the system are the circular badge lockup and 6px status dots. There is no shadow in normal layout: elevation is expressed as graphite fill + 1px Blueprint hairline. Shadow exists only for true overlays (`--shadow-overlay` on dialogs, `--shadow-lift` on toasts). Borders are always exactly 1px; 2px is reserved for a toast's accent edge.

### Backgrounds & imagery
Flat Vertex Black, with an optional barely-visible blueprint grid (`--grid-blueprint`, 40px, Blueprint Line at 35%) behind full-bleed sections — a technical sketch feel, never a texture you consciously notice. **No gradients as decoration.** The only gradients in the system are protection scrims: `--scrim-bottom` (behind text on imagery) and `--scrim-left` (behind text on a full-bleed hero). Any text over a photo sits on a scrim, never on a rounded capsule.

Photography is full-bleed, cool-shadowed, warm-highlighted (gold light on cold metal), macro and physical — stitch work, engine bays, panel gaps, stance. Full-frame, square corners, no rounding, no drop shadow, no border except the hairline. **This system ships no photography.** `MediaFrame` without a `src` renders a blueprint placeholder with crosshair registration marks — use it rather than sourcing an off-brand image.

### Motion
Restrained and purposeful. Two signature moves only: blueprint rules **draw themselves** on scroll into view (900ms, `--ease-draw`), and spec numbers **count up from 0** (1200ms ease-out cubic). Controls transition colour/border only, 160ms. Modal panels fade with the scrim. No bounce, no spring, no parallax, no scroll-jacking, no entrance animations on text. `prefers-reduced-motion` collapses the draw and count-up to 1ms.

### Interaction states
- **Hover:** gold fills darken to Aged Brass; outlined controls warm their border from Blueprint to gold; muted text steps up to Paper White; card borders warm to gold (260ms). No scale, no lift, no shadow.
- **Press:** 1px downward nudge on buttons; outlined controls take a `--gold-wash` fill. No shrink.
- **Focus:** 1px gold outline, 2px offset — and inputs warm their whole border to gold.
- **Disabled:** `#2A2C30` fill, `#5C5C58` text, `not-allowed`; outlines drop to `--line-faint`.
- **Active/selected:** a 1px gold segment of an existing rule (tabs, nav) — never a pill or a filled background.

### Transparency & blur
Used in exactly two places: the translucent header over the hero film (`rgba(11,12,14,0.55)` + 14px blur) and the dialog scrim (82% black + 3px blur). Nowhere else — no frosted cards, no glassmorphism.

---

## Iconography

**Vertex has no icon set of its own.** The brand concept specifies no icon library, and the design preview contains zero icons — its only vector content is the logo mark and two CSS-drawn shapes (the rare-tag dot, the swatch grid).

- **Substitute (flagged): [Lucide](https://lucide.dev) via CDN**, `unpkg.com/lucide@0.462.0`. Chosen because its 1.5px geometric open stroke is the closest available match to the drafting/blueprint register; a filled or rounded set (Material, Phosphor Fill) would fight the hairline language. **Please confirm or replace this choice.**
- Usage: `<Icon name="arrow-right" size={14} />`. Always 1.5 stroke, `currentColor`, never filled, never larger than 22px. Gold only when the icon is *the* emphasised element (a solid play button).
- Icons are always functional — inside a control, or paired with a mono label. Never decorative, never a feature-card ornament, never in body copy.
- **Emoji are never used**, in UI or in copy.
- **Unicode as glyph:** yes, sparingly and typographically — `№` for project numbers, `—` en dash, `·` as a separator in mono meta lines, `×` for dimensions. These are set in the mono face, not as icons.
- **Hand-drawn 1px shapes, not glyphs**, for anything structural: the Select caret, the Checkbox tick, the Radio node (a rotated square), the BeforeAfter drag handle, dimension ticks. These are drawn from borders so they inherit the hairline exactly.
- **Logo files** in `assets/`: `logo-mark.svg` (two-facet apex, gold + paper), `logo-mark-gold.svg`, `logo-mark-paper.svg` (single-colour), `logo-lockup-horizontal.svg` (mark + Italiana wordmark), `logo-badge.svg` (circular). All extracted verbatim from the supplied design preview — nothing was redrawn or invented. Clear space = the height of the mark. Never place the lockup on gold; never recolour the two facets independently.

---

## Substitutions & gaps — please review

1. **Fonts are loaded from Google Fonts, not self-hosted.** No binaries were supplied. All five faces (Italiana, Orbitron, IBM Plex Sans, IBM Plex Mono, JetBrains Mono) exist on Google Fonts under exactly the names in the brand concept, so this is a delivery substitution, not a typeface substitution. `tokens/fonts.css` holds the single `@import`; swap it for local `@font-face` rules if you can send the files.
2. **The brand concept's type-scale table contradicts itself** — it lists "Hero display: 80–120px, **Fraunces**" and "Section headline: 40–56px, Fraunces", but every other section (and the rendered preview) specifies Italiana + Orbitron, and Fraunces appears nowhere else. This system follows Italiana/Orbitron and treats the Fraunces mentions as a leftover. **Confirm.**
3. **Icon set substituted** (Lucide) — see Iconography.
4. **No photography.** Blueprint placeholders stand in everywhere an image belongs.
5. **The logo was not finalised in the brief**, but a concrete mark exists in the supplied preview; it was copied as-is rather than explored further. If you want the "drafting symbol" direction developed, that is a separate exploration.

---

## Index

| Path | What it is |
|---|---|
| `styles.css` | Root entry point — `@import` list only. Consumers link this one file. |
| `tokens/fonts.css` | Google Fonts `@import` for all five faces |
| `tokens/colors.css` | Base palette, derived neutrals, semantic aliases (surface / text / line / action / signal) |
| `tokens/typography.css` | Families, weights, size scale, leading, tracking, `--type-*` shorthands |
| `tokens/spacing.css` | 4px scale + semantic rhythm (gutters, measures, control sizing) |
| `tokens/borders.css` | Radius (0), border shorthands, the two shadows, blueprint grid + scrim gradients |
| `tokens/motion.css` | Durations, easings, reduced-motion overrides |
| `tokens/base.css` | Element resets, link and focus defaults |
| `assets/` | Logo mark, single-colour marks, horizontal lockup, circular badge |
| `guidelines/*.card.html` | 17 foundation specimen cards (Colors, Type, Spacing, Brand) |
| `components/` | Reusable primitives — see below |
| `ui_kits/website/` | Interactive recreation of all five website surfaces (`index.html`) |
| `uploads/` | The original brand concept and design preview, as supplied |
| `SKILL.md` | Agent-Skills front matter for use outside this project |

### Components

**`components/core/`** — `Button`, `IconButton`, `Icon`, `Tag`, `Badge`, `Card`, `Logo`
**`components/brand/`** — `HeadlineSplit`, `SpecNumber`, `Eyebrow`, `SectionTitle`, `BlueprintRule`, `MediaFrame`
**`components/forms/`** — `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`
**`components/navigation/`** — `SiteHeader`, `SiteFooter`, `Tabs`
**`components/feedback/`** — `Dialog`, `Toast`, `Tooltip`
**`components/patterns/`** — `BuildCard`, `SpecTable`, `BeforeAfter`, `AcousticPlayer`

Each directory carries a `@dsCard` HTML showing its states, and each component has a sibling `.d.ts` (props contract) and `.prompt.md` (what & when, usage, variants).

### Intentional additions

The source defines no component inventory, so the standard set was authored. Six additions are brand-specific rather than generic, each traceable to a named element in the brief:

- `HeadlineSplit` — the two-font headline construction (§8 Typography, "never mix the luxury and tech fonts")
- `SpecNumber` — the signature blueprint spec callout (§8 "Signature Element")
- `BlueprintRule` — the 1px structural rule with dimension ticks and draw-on-scroll (§8 Visual Language, Motion)
- `MediaFrame` — enforces square corners + protection scrim on all imagery
- `BuildCard`, `SpecTable`, `BeforeAfter`, `AcousticPlayer` — the Available Builds tile, spec breakdown, donor→build slider and Acoustic Experience player named in §7
- `Icon` — a wrapper over the substituted Lucide set

`Tabs`, `Toast`, `Tooltip` and `Switch` are from the standard set and have no counterpart in the brief; drop them if you'd rather keep the system tight.

## Status

Complete: tokens, fonts, logo assets, 30 components with `.d.ts` contracts and `.prompt.md` guides, 17 foundation specimen cards, 6 component cards, the website UI kit (5 surfaces, interactive), project thumbnail, `SKILL.md`.

No slide template was supplied, so no sample slides were authored. Ask if you want a deck built on these foundations.
