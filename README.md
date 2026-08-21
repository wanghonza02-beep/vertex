# Vertex — landing page

A dark-mode marketing site for Vertex, a restomod atelier, built from the brand
concept and design system already in this workspace (`vertex-brand-concept.md`,
`Vertex Design System/`).

**Current architecture (superseded the original static-only build below):** the
landing page is now a fullscreen, fixed WebGL scene — a Three.js r175 infinite
cylindrical card grid with a floating 2D chrome overlay (logo, sound toggle,
studio clock, CTA, view toggle, section pills, filter), styled after
phantom.land at the client's explicit direction. No scroll, no sections beneath
it — for any WebGL-capable visitor, `index.html` **is** the 3D scene and
nothing else. Source: `src/scene.js` (the grid), `src/cardTexture.js` (the
placeholder card faces), `src/main.js` (bootstraps it + the chrome),
`css/webgl-grid.css`.

The original multi-section 2D site (hero, philosophy stats, fleet carousel,
craft/process, gallery, contact form, footer) still exists in two places:
- `full-site.html` — a standalone, byte-identical snapshot, preserved rather
  than deleted when the brief changed to WebGL-only, in case it's wanted again.
- `#siteFallback` inside `index.html` itself — the *real* fallback for visitors
  without WebGL, not a stub. `js/main.js` renders and reveals it the moment
  `window.__vertexWebGL` (feature-detected inline in `<head>`) is false, or if
  `src/main.js` catches a runtime WebGL failure despite the feature-detect
  passing. It scrolls on its own independent `overflow-y`, since the WebGL
  stage's fullscreen lock sets `html,body{overflow:hidden}`.

## Preview it

This now has a real build step (Vite, for the Three.js/GLSL module graph):

```bash
npm install     # already run once; only needed again after a fresh clone
npm run dev     # prints the local URL, usually http://localhost:5173
```

To see the 2D fallback path without a second device, force it: open DevTools →
Console → run `HTMLCanvasElement.prototype.getContext = () => null` → reload.

or, from VS Code, right-click `index.html` → **Open with Live Server** if you
have that extension.

## What's here

```
index.html               fullscreen WebGL stage + chrome, and #siteFallback (the full 2D site)
full-site.html            standalone snapshot of the pre-WebGL multi-section site
package.json, vite.config.js    Vite + three, added when the brief moved to WebGL
src/
  scene.js                the infinite cylindrical card grid — drag physics, curvature, hover
  fleetData.js             the 12 showcase cars: id, brand, invented project codename, video/poster paths
  cardTexture.js           composites each card face — 80% looping video, 20% metadata bar
  main.js                  bootstraps the scene + wires the floating chrome
css/
  site.css                #siteFallback's styles — imports the tokens below
  webgl-grid.css           the WebGL stage + chrome (see Tech stack)
  tokens/                 copied verbatim from Vertex Design System/tokens/ (colors, type, spacing, motion, etc.)
js/
  data.js                 the 10 real builds + process steps + gallery captions + footer links
  main.js                  renders #siteFallback's data-driven sections; gated behind activateFallback()
  carousel.js               #siteFallback's fleet drag-to-scroll behaviour
  magnify.js                 the precision-loupe hover lens
  dialog.js                    build-detail overlay + image lightbox + acoustic player
  cursor.js, nav.js, reveal.js, media.js, form.js, icons.js    one concern each, all #siteFallback-only
assets/
  svg/motifs/             9 original blueprint-schematic illustrations for #siteFallback (car detail/
                          silhouette motifs) — the two Our Philosophy workshop illustrations that
                          used to live here were deleted once real workshop photos replaced them
  svg/logo-*.svg          copied verbatim from Vertex Design System/assets/
  video/README.md         exact filenames to drop in for #siteFallback's hover-preview footage
public/
  cars/videos/            the 12 WebGL showcase cards' real footage (1.mp4–12.mp4), plus ig1–ig3.mp4
                          and 1-1.mp4–1-4.mp4 for the Our Philosophy page — must live under public/,
                          not the project root, or vite build silently drops it
  cars/photos/            per-car photo sets (12 subfolders, 6 images each) dropped in but not yet
                          wired to anything — noted here so a future session knows they exist;
                          integrating them is a separate, not-yet-scoped design decision
  philosophy/             the 2 real Our Philosophy workshop photos (car-factory.jpg, work-desk.jpg;
                          full-res originals in original/) — same public/ requirement as the videos
  audio/background-music.mp3   the sound-toggle's looping track, wired in src/main.js (same public/ requirement)
```

## Tech stack — and why

**The WebGL grid:** Three.js r175 (`three`, pinned), loaded via Vite — not
React Three Fiber, since nothing else here uses React/JSX and R3F would mean
adding both for no real benefit. Curvature is per-card position/rotation trig
around a virtual cylinder, computed in JS each frame — not a vertex shader —
so every card stays its own independently-raycastable mesh (needed for
per-card hover/click), which a single shader-warped surface or a
texture-atlas cylinder would make much harder to get right. "Infinite" is a
fixed pool of 35 meshes whose position and content (a repeating 4×3 tile of
the 12 `FLEET_DATA` cars) are recomputed from a continuous pan offset every
frame — not real infinite geometry.

Each of those 12 cards is a `<video>` (autoplay/loop/muted, playing
continuously from load, not gated on hover) composited onto a canvas — 80%
video viewport, 20% dark metadata bar with brand + project codename — and
that canvas is what actually gets uploaded as each mesh's texture. Only 12
canvases exist regardless of how many of the 35 pool meshes currently show
that card, since meshes just reference one of the 12 shared `CanvasTexture`s.
Each canvas redraw is further gated on `requestVideoFrameCallback` where the
browser supports it, so it only redraws (and re-uploads to the GPU) when its
video actually has a new decoded frame — real footage decoding at ~24-30fps
doesn't need a canvas redraw on every ~60fps render tick, and with 12 clips
playing at once that's a genuine cost, not premature optimization. A
`.webgl-vignette` layer (`css/webgl-grid.css`) sits above the canvas and below
the chrome (explicit z-index on every layer) — a `backdrop-filter: blur()`
masked by a radial gradient, so the rim of the screen softens toward the edges
and the floating chrome stays completely crisp regardless.

**List View** (`css/webgl-grid.css` `.webgl-list-view`, populated in
`src/main.js`) is a second panel above the canvas — not a shader or DOM
overlay on individual cards — toggled via `.is-list-view` on `.webgl-stage`
from the bottom-left "3D Fleet / List View" pill. Frosted glass on purpose
(`rgba(10,10,12,0.65)` + `backdrop-filter: blur(16px)`): the 3D scene stays
visible-but-blurred behind it rather than being fully hidden. Its 12 rows are
built straight from `FLEET_DATA`, so it can never drift out of sync with the
3D grid's own card content. Row clicks and 3D card clicks both funnel into one
`activateCar()` in `src/main.js` — currently just the status toast, and the
documented seam for wiring in a real detail page/modal later.

**Our Philosophy** (`.webgl-philosophy-view`, static markup in `index.html`,
toggled via `.is-philosophy-view` on `.webgl-stage` from the "Fleet / Our
Philosophy" tabs — now bottom-right, where Filter used to sit; the bottom-left
"3D Fleet / List View" pill fades out while this section is open, since it
only ever meant something inside Fleet) is the opposite background call from
List View on purpose: solid `var(--vertex-black)`, not frosted — it's several
screens of long-form reading and its own media, and a busy blurred 3D collage
behind that much text would fight it for attention rather than support it.
Its real copy (headline, lead/body, the four stat numbers) is copied from the
`#philosophy` section already written for `#siteFallback`, not invented.

The Craft's 5 tiles are now all real footage — `ig2`/`ig3` from the original
integration plus `1-1`–`1-3` (precision machining, engine, hand-stitched
trim), each picked to literally match its caption rather than assigned
arbitrarily. A 6th clip (`1-4`, a car under a reveal cloth) didn't fit the
per-process-step grid at all, so it became its own new "The Reveal" section
instead — a closing beat after the process grid, not another grid tile.
"Our Workshop" no longer uses placeholder art: two real photos
(`public/philosophy/car-factory.jpg`, `work-desk.jpg` — downscaled from
21MB/22MB originals to ~1600px-wide JPEGs; full-res kept in `original/`)
replaced the `workshop-bay.svg`/`workshop-bench.svg` blueprint illustrations,
which were deleted once real material existed for exactly what they stood in
for. "Selected Partnerships" is untouched — still dashed empty slots with an
honest "no partnerships to disclose yet" note, since real photography solves
a missing-asset problem but doesn't invent business relationships that don't
exist. Likewise there's still no fabricated team member/founder photo or bio;
"The People Behind Every Build" — since replaced by the new site footer
anyway — was a discipline list, never an invented person.

Every visit to the section (not just the first) replays three coordinated
systems from scratch, all wired through one pair of functions in
`src/main.js`: **`enterPhilosophyView()`** replays the hero's staggered
fade-up entrance (headline beat, then a deliberate 0.75s hold, then the
lead/body/stats beat — the two-beat gap is the point, a shorter one would just
read as one continuous stagger), rebuilds a single `IntersectionObserver`
rooted against `.phi-scroll` (not the page — this stage doesn't page-scroll)
that fades in and autoplays each media block the instant it's scrolled to,
and resets+replays the four stat counters (mirrors `js/reveal.js`'s
`animateNumber` — same cubic-ease-out, same 1200ms, same comma/plus-preserving
snap-back — copied rather than called directly, since that helper's observer
always roots against the page viewport and never resets after firing once,
neither of which holds here). **`leavePhilosophyView()`** pauses and rewinds
every video on the page so nothing keeps decoding while hidden and the next
entrance is a genuine restart, not a resume. One thing worth knowing if this
page is touched again: the `autoplay` HTML attribute alone did not reliably
start every video in testing (the immediately-visible hero clip played, ones
further down the page didn't, despite identical markup) — video playback here
is entirely `.play()`-driven from JS (on scroll-reveal, or directly for the
hero), not the passive attribute.

**Everything else — `#siteFallback` and its `js/*.js`:** plain HTML5 + CSS
custom properties + vanilla ES6, no bundler, no framework. That predates the
WebGL requirement and the reasoning still holds for that part of the codebase:

- **Drag performance.** The fleet carousel (and the WebGL grid's own drag,
  same technique) moves via a hand-tuned `transform`/position update on
  `requestAnimationFrame`, not framework state — the same approach
  Embla/Swiper use internally, done by hand for exact control over momentum,
  rubber-band overscroll and snap rather than fighting a library's defaults.
- **Motion restraint is a brand rule, not just a preference.** `SKILL.md`
  names exactly two signature moves — blueprint rules drawing themselves on
  scroll, and spec numbers counting up — and explicitly bans gratuitous
  parallax and scroll-jacking. That's a couple of `IntersectionObserver`
  calls, not a reason to add GSAP.
- Icons are Lucide via the same CDN URL the design system's own `Icon.jsx`
  already specifies (`SKILL.md` → Iconography) — no new substitution.

One real gotcha from wiring the two together: `js/carousel.js` used to call
`setPointerCapture` on every `pointerdown`, including a zero-movement click —
found via browser testing to silently break native click targeting in
Chromium. Fixed by deferring capture until real drag movement is detected;
worth knowing if either drag implementation is touched again.

## The no-photography decision

This predates real footage existing anywhere in the workspace, and still
governs everything except the WebGL showcase cards below: no photo, video, or
audio file existed, so every media slot used original vector "blueprint
schematic" artwork (`assets/svg/motifs/`) in the exact placeholder language
the design system itself specifies (`MediaFrame` with no `src`: *"renders a
blueprint placeholder... use it rather than sourcing an off-brand image"*).
Two reasons this is more than following instructions:

1. **Every Vertex build is sold as one of one — physically unable to exist
   twice.** A stock photo of *a* Porsche silently contradicts that the moment
   a visitor recognizes it, which is a real risk for a brand whose entire
   premise is uniqueness.
2. It made the magnify lens and the before/after slider demonstrable without
   waiting on real assets, using original artwork rather than a gray box.

**This is the one substitution worth your explicit sign-off** — everything
else in this build follows the brand materials directly, but a decision to
launch with technical-drawing illustrations instead of photography is a real
creative call for an automotive brand, and you may want actual photography
here instead. If so, drop images at the paths already wired up (`<img>` tags
throughout use `assets/svg/motifs/*` — swap the `src`) and update the aspect
ratios in `css/site.css` if your photography isn't 3:2 (fleet cards) / 1:1
(gallery) / 4:3 (dialog).

Video works the same way: every `<video>` already has
`autoplay muted loop playsinline` and points at a `data-src` path (see
`assets/video/README.md` for the exact filenames). Nothing exists there yet —
`js/media.js` fails silently on a 404 and the illustration keeps showing, so
the page never breaks; drop a real file at the documented path and it plays,
no code changes.

The acoustic player (cold start / exhaust note) is a visual simulation only —
matching the design system's own `AcousticPlayer.jsx` reference, which is also
simulation-only with no real `<audio>` element.

## Content that's a placeholder, not a fact

Flagged so nothing accidentally ships as real business information:

- Contact details in the inquiry section (`enquiries@vertex-atelier.com`,
  `+1 (555) 010-0142`) — replace with real ones.
- "Since 2019" in the Philosophy section, and every scarcity figure ("4 slots
  remain in 2026," "10 builds completed") — these came from the sample
  4-build dataset already in `Vertex Design System/ui_kits/website/data.js`,
  extended to 10 in the brand's own voice. Update `js/data.js` once real
  inventory exists — everything (cards, dialog specs, stat counts) renders
  from that one file.
- The contact form has no backend. It validates and shows a real "Enquiry
  sent" confirmation, but nothing is transmitted yet — see the
  `INTEGRATION POINT` comment in `js/form.js` for where to wire Formspree,
  Netlify Forms, or your own endpoint.

## Verified working

Tested with a headless Chromium pass (desktop 1440px + mobile 390px) covering:
fleet drag-scroll and momentum, click-vs-drag disambiguation, magnify lens
hover, build-detail dialog open/close/acoustic-playback, before/after slider
drag, gallery lightbox, mobile hamburger menu, scroll-triggered count-up and
blueprint-draw animations, contact form validation + toast, and full keyboard
navigation (Tab order, Enter/Escape on cards, dialogs and the slider). Zero
console or JS errors; the only network 404s are the intentionally-absent video
files described above.

Two real bugs turned up only under that testing and are now fixed:
`carousel.js` was capturing the pointer on every press (even a plain click),
which silently broke the browser's native click targeting in Chromium (the
WebGL grid's own drag in `src/scene.js` was built with the same deferred-
capture fix from the start); and a CSS specificity tie between `.icon-toggle`
and the native `[hidden]` attribute meant the hamburger/close and play/pause
icon pairs were both rendering at once. Both are the kind of interaction bug
that's very hard to catch by reading code alone.

The WebGL grid itself was separately verified: canvas fills the viewport and
renders (fullscreen, desktop + mobile), drag/momentum/curvature/hover-tilt/
click-select/wheel-scroll/resize all confirmed, `html,body{overflow:hidden}`
holds (page genuinely cannot scroll while the grid is active), and — the part
most likely to break silently — the forced-no-WebGL path was tested with
`HTMLCanvasElement.prototype.getContext` stubbed to return `null`: the full
`#siteFallback` site correctly reveals itself, scrolls on its own independent
axis despite the outer lock, and the (by-then pointer-events:none) WebGL
stage doesn't block clicks to the content sitting beneath it.

## Browser support

Built on Pointer Events, `IntersectionObserver`, CSS `gap` on flexbox, and
`aspect-ratio` — all baseline in current Chrome/Edge/Firefox/Safari. No IE11
consideration was made.
