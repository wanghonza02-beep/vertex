# Video slots

No footage ships with this build — see the root `README.md` for why (the short
version: a stock car video would contradict "every build is one of one," so the
site ships with original blueprint-schematic artwork instead and is fully wired
to switch to real footage the moment you drop files in here).

Every `<video>` in the page already has `autoplay muted loop playsinline` and a
`data-src` pointing at one of the paths below. `js/media.js` sets the real `src`
from `data-src`, and if the file 404s it fails silently and the SVG motif keeps
showing — nothing breaks if you leave this folder empty. No HTML/CSS/JS changes
are needed once a file exists at the expected path.

## Hero background

```
assets/video/hero-loop.mp4
```

Plays full-bleed behind the headline. Suggested: 1920×1080 or larger, 8–15s,
seamless loop, H.264 mp4, no audio track needed (muted), under ~6 MB if possible
— it autoplays on load so file size directly affects perceived page speed.

## Fleet card hover previews

```
assets/video/fleet/p01.mp4   Project 01 — 1989 Porsche 911 Targa "Monaco Edition"
assets/video/fleet/p02.mp4   Project 02 — 1971 Mercedes-Benz 280 SL "Riviera"
assets/video/fleet/p03.mp4   Project 03 — 1984 Lamborghini Jalpa "Sant'Agata"
assets/video/fleet/p04.mp4   Project 04 — 1993 Porsche 964 Turbo "Nordschleife"
assets/video/fleet/p05.mp4   Project 05 — 1987 Ferrari 328 GTS "Fiorano"
assets/video/fleet/p06.mp4   Project 06 — 1965 Porsche 911 "Ur-Elfer"
assets/video/fleet/p07.mp4   Project 07 — 1976 Mercedes-Benz 450 SL "Côte d'Azur"
assets/video/fleet/p08.mp4   Project 08 — 1990 Lamborghini Countach 25° "Imola"
assets/video/fleet/p09.mp4   Project 09 — 1972 Porsche 911 S "Sexpress"
assets/video/fleet/p10.mp4   Project 10 — 1969 Mercedes-Benz 280 SE Cabriolet "Alpine"
```

These are lazy: nothing loads until a visitor's pointer hovers that specific
card, and only one plays at a time, so CPU/bandwidth stay flat regardless of
how many files exist. Keep each clip short (3–6s) and small (a few hundred KB
to ~2MB) — a 3:2 crop matching the card's media frame reads best. If you add a
project beyond the current 10, add its clip here using the same `id` you give
it in `js/data.js`.

To change the donor→build slot IDs, edit `js/data.js` — the `id` field on each
build is what `media.js` uses to build this path.

## WebGL showcase cards live elsewhere: public/cars/videos/

The fullscreen WebGL grid's 12 cards are a separate lineup from the 10 builds
above — see `src/fleetData.js` for the full list (brand, invented project
codename, video/poster paths) and `src/cardTexture.js` for how each card
composites onto a canvas (80% video viewport, 20% metadata bar). Their footage
lives at `public/cars/videos/1.mp4`–`12.mp4` (served at `/cars/videos/*.mp4`;
`public/` specifically, not the project root, so it survives `vite build` too)
and autoplays continuously from page load, not on hover. `public/cars/photos/`
is reserved for optional poster stills, shown while a clip's first frame is
still loading — empty is fine, nothing breaks without it. A missing or 404ing
clip falls back to the same blueprint-schematic placeholder used elsewhere on
the page; the brand/model text in the bottom bar still renders from
`src/fleetData.js` either way.

**Codec note:** the 12 clips as originally supplied were HEVC/H.265
(1920×1080, 10-bit) — unplayable in a plain `<video>` in Chrome, Firefox, or
Edge without a separately-installed OS codec extension (only Safari supports
HEVC natively). They were transcoded to H.264/yuv420p in place
(`ffmpeg -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart`) so the
grid actually plays for the browsers most visitors use. The original HEVC
files are preserved, untouched, at `public/cars/videos-hevc-original/` in case
higher-quality masters are needed later — nothing in the app references that
folder. If you add more clips here yourself, re-encode to H.264 (or AV1/VP9
with an H.264 fallback) before dropping them in, or they'll silently fail the
same way.

## Our Philosophy page's footage: ig1–ig3.mp4 and 1-1.mp4–1-4.mp4

Also in `public/cars/videos/` (same folder, same `public/` requirement) —
`ig1`–`ig3` are the original three IG clips (hero accent + 2 of the 5 "Craft"
tiles); `1-1`–`1-3` fill the rest of that same tile grid (precision
machining, engine, hand-stitching), picked to literally match each tile's
caption. `1-4` (a car under a reveal cloth) didn't fit that per-process-step
format, so it's the sole video in its own "The Reveal" section instead. These
four arrived already H.264 — no transcode needed, unlike the batch above.
