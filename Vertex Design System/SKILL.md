---
name: vertex-design
description: Use this skill to generate well-branded interfaces and assets for Vertex, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for protoyping.
user-invocable: true
---

# Vertex design skill

Read `readme.md` in this skill folder for the full guide (brand context, content fundamentals, visual foundations, iconography, substitutions). Everything below is the working summary — enough to design correctly without opening another file.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out of `assets/` and produce static HTML that links `styles.css`. If working on production code, copy the tokens and follow the rules here. If invoked with no other guidance, ask what the user wants to build, ask a few questions, then act as an expert designer producing HTML artifacts _or_ production code.

## What Vertex is

A restomod atelier. It buys rare classic donor cars (air-cooled Porsche 911s, classic Mercedes SLs, vintage Lamborghinis), strips them to bare metal, and rebuilds them with modern powertrains and bespoke interiors — 1,000+ hours per car, one of one, ultra-premium. The brand sits at the *vertex*: the apex where a classic's soul meets a modern car's performance. Every design must hold that tension — editorial fashion-serif for heritage, HUD/dashboard face for engineering, technical-drawing hairlines underneath.

## Non-negotiables

1. **0px border-radius everywhere.** Buttons, cards, inputs, images, tags, toggles. The only curves are the circular badge lockup and 6px status dots.
2. **No shadows in layout.** Elevation = graphite fill + 1px hairline. Shadow only on dialogs/toasts.
3. **Gold is rationed** — one Champagne Gold element per screen region. Corsa Red harder still: motion indicators and rare/limited tags only.
4. **Never mix the two display faces inside one clause.** One Italiana clause, then hand off to one Orbitron clause.
5. **No gradients as decoration.** Only protection scrims behind text on imagery.
6. **No emoji, ever.** No exclamation marks. No "Learn more".
7. **Never pure white.** Paper White `#EDE8DD` is the lightest value.
8. **Dark only.** There is no light mode.

## Tokens

```css
/* Colour — 7 base values */
--vertex-black:#0B0C0E;    /* page */
--graphite:#1A1C1F;        /* every panel and card */
--graphite-raised:#212429;
--champagne-gold:#C9A66B;  /* the single accent, rationed */
--aged-brass:#8C7248;      /* gold's hover partner; small mono labels */
--paper-white:#EDE8DD;     /* headings */
--paper-muted:#B9B4A7;     /* body copy */
--paper-dim:#7C786F;       /* captions, disabled */
--blueprint-line:#2E3B47;  /* all dividers, borders, grid */
--corsa-red:#C1272D;       /* motion indicators, rare tags only */
--gold-wash:rgba(201,166,107,0.12);   /* pressed states */
--scrim:rgba(11,12,14,0.82);          /* dialog backdrop */

/* Type */
--font-luxury:'Italiana',serif;              /* 66–96px display, wordmark (+0.12em) */
--font-tech:'Orbitron',sans-serif;           /* 900, 52–74px, UPPERCASE, always gold */
--font-body:'IBM Plex Sans',system-ui;       /* 16–19px / 1.6, 560px measure */
--font-mono:'IBM Plex Mono',monospace;       /* 11–13px UPPERCASE +0.12em labels/CTAs */
--font-numeric:'JetBrains Mono',monospace;   /* 700, 28–88px, −0.02em spec figures */

/* Spacing — 4px base */
--space-1..40: 4 8 12 16 20 24 32 40 48 64 80 96 120 160
--gutter-page:40px; --gutter-page-wide:64px;
--measure-content:980px; --measure-wide:1440px; --measure-text:560px;
--section-gap:120px; --card-pad:28px; --control-height:48px;

/* Motion — two signature moves only */
--duration-draw:900ms;   /* blueprint rules draw themselves on scroll */
--duration-count:1200ms; /* spec numbers count up from 0 */
--duration-fast:160ms;   /* control colour transitions */
--ease-out-technical:cubic-bezier(0.16,1,0.3,1);
--ease-draw:cubic-bezier(0.65,0,0.35,1);
```

Full set with semantic aliases: `tokens/colors.css`, `typography.css`, `spacing.css`, `borders.css`, `motion.css`, `base.css` — all reachable from `styles.css`.

## Interaction states

- **Hover** — gold darkens to Aged Brass; outlined borders warm Blueprint → gold; muted text steps up to Paper White; card borders warm to gold (260ms). No scale, no lift.
- **Press** — 1px downward nudge; outlines take a `--gold-wash` fill. No shrink.
- **Focus** — 1px gold outline, 2px offset; inputs warm their whole border.
- **Active/selected** — a 1px gold segment of an existing rule. Never a pill or filled background.
- **Disabled** — `#2A2C30` fill, `#5C5C58` text.

## Copy rules

Short declaratives, often two clauses with a full stop between: *"We do not build cars. We resurrect legends."* First-person plural for the studio, second person only for the client's own decisions. **Specificity replaces superlatives** — "1,247 hours of hand-finishing", not "the best in the world"; if a claim can carry a number, it carries a number. Sentence case for headlines and body; UPPERCASE mono with tracking for labels, eyebrows, CTAs, tags, captions. En dash between a project code and its donor: `Project 01 — 1989 Porsche 911`. CTAs are 2–4 word verbs: "View the build", "Request a build slot", "Enter the archive". Scarcity is stated, never performed. A Vertex buyer is a *client* or *owner*, never a "customer".

## Iconography

Vertex has **no icon set of its own** — the sources contain zero icons. Substituted: **Lucide** via `unpkg.com/lucide@0.462.0` (1.5px open geometric stroke, closest to the drafting register). Always 1.5 stroke, `currentColor`, never filled, max 22px, gold only when it *is* the emphasised element. Icons are always functional, never decorative. Structural glyphs (select caret, checkbox tick, radio node, drag handle, dimension ticks) are **drawn from 1px borders**, not glyphs, so they inherit the hairline exactly. Unicode used typographically in mono: `№ — · ×`.

## Assets

`assets/logo-mark.svg` (two-facet apex, gold + paper), `logo-mark-gold.svg`, `logo-mark-paper.svg`, `logo-lockup-horizontal.svg` (mark + Italiana wordmark), `logo-badge.svg` (circular). Clear space = the height of the mark. Never place the lockup on gold; never recolour the facets independently. **No photography ships with this system** — use a blueprint placeholder with crosshair registration marks rather than an off-brand image.

## Components

React, one file each, styled entirely through the CSS custom properties. Every component has a sibling `.d.ts` (props contract) and `.prompt.md` (what & when + usage). Read the `.prompt.md` before using an unfamiliar one.

- `components/core/` — **Button** (primary/secondary/ghost/alert × sm/md/lg), **IconButton**, **Icon**, **Tag**, **Badge**, **Card**, **Logo**
- `components/brand/` — **HeadlineSplit** (the two-font headline), **SpecNumber** (the signature blueprint dimension callout), **Eyebrow**, **SectionTitle**, **BlueprintRule**, **MediaFrame**
- `components/forms/` — **Input**, **Textarea**, **Select**, **Checkbox**, **Radio**, **RadioGroup**, **Switch**
- `components/navigation/` — **SiteHeader**, **SiteFooter**, **Tabs**
- `components/feedback/` — **Dialog**, **Toast**, **Tooltip**
- `components/patterns/` — **BuildCard**, **SpecTable**, **BeforeAfter** (donor→build slider), **AcousticPlayer**

The two signature elements to reach for first:

```jsx
<HeadlineSplit size="hero" luxury="Immortal Icons." tech="Modern Muscle." />

<SpecNumber value={640} unit="hp" label="Power output" tone="gold" countUp />
<SpecNumber value="3.2" unit="sec" label="0–100 km/h" />
```

Group 3–4 `SpecNumber`s in a row with 70px gaps; at most one `tone="gold"` per group.

## Reference implementation

`ui_kits/website/index.html` — interactive click-through of all five Vertex website surfaces (homepage, build showcase, legacy archive, commission, private showroom). Open it to see the system assembled correctly; read `ui_kits/website/README.md` for what works and what is deliberately absent.

## Known substitutions — verify with the user

1. **Fonts load from Google Fonts** (`tokens/fonts.css`), not self-hosted. No binaries were supplied; all five faces match the named typefaces exactly.
2. **Icon set substituted** (Lucide) — no icons existed in the sources.
3. **The brand brief contradicts itself on display type** — its scale table names *Fraunces*, every other section and the rendered preview name Italiana + Orbitron. This system follows Italiana/Orbitron.
4. **No photography.** Blueprint placeholders stand in.
5. **Logo copied verbatim** from the supplied preview; the brief called it not finalised.
