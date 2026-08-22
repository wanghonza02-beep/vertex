import mediaManifest from 'virtual:car-media';
import { observeReveal, observeVideoLifecycle, bindBackButtonScrollFade } from './panelReveal.js';

/* The car detail page — a fourth full-panel view inside #webglStage, sitting
   at a HIGHER z-index (8) than both the 3D grid (canvas, z-index 1) and List
   View (.webgl-list-view, z-index 7): unlike Our Philosophy (which shares
   List View's own tier and is mutually exclusive with it), a car detail can
   be opened from EITHER the 3D grid or List View, so it must cover whichever
   one was showing rather than swap with it. That's also why closing it needs
   no state restore — nothing underneath is ever touched, just covered, so
   whatever was visible before reappears unchanged. See index.html for the
   panel's static shell (just the back button + an empty scroll container —
   everything else here is rebuilt per car) and css/webgl-grid.css for
   .webgl-detail-view / .detail-* / the shared .phi-* atoms this reuses
   (eyebrow, meta, body copy, and the stat-counter markup — same visual
   component as Our Philosophy's four stats, same panelReveal.js helpers). */

let activeObserver = null;
let activeVideoLifecycle = null;
let cleanupTimer = null;
let isOpen = false;

// Every car's own showcase clip (already a real 3D-grid card texture) becomes
// the hero AND appears once more, differently framed, as the closing Feature
// Showcase Banner would have — except the banner slot below is filled by the
// last dynamically-detected photo instead, so the same clip isn't shown
// twice in a row; see galleryTilesFor.
function galleryTilesFor(entry) {
  const photos = mediaManifest.photosByFolder[entry.photoFolder] || [];
  const extraVideos = mediaManifest.extraVideosById[entry.id] || [];
  const photoTiles = photos.map((file) => ({
    type: 'image',
    src: '/cars/photos/' + encodeURIComponent(entry.photoFolder) + '/' + file
  }));
  // Last photo becomes the full-bleed Feature Showcase Banner instead of a
  // regular grid tile — dynamic (whatever the last file happens to be),
  // rather than guessing which of 6-7 generic studio shots is "the engine
  // bay" and risking a caption that doesn't match the image.
  const feature = photoTiles.length ? photoTiles[photoTiles.length - 1] : null;
  const grid = (feature ? photoTiles.slice(0, -1) : photoTiles)
    .concat(extraVideos.map((file) => ({ type: 'video', src: '/cars/videos/' + file })));
  return { grid, feature };
}

function galleryTileHTML(tile) {
  return tile.type === 'video'
    ? '<div class="detail-gallery-tile detail-gallery-tile--video"><video muted loop playsinline preload="metadata" src="' + tile.src + '"></video></div>'
    : '<div class="detail-gallery-tile"><img src="' + tile.src + '" alt="" loading="lazy"></div>';
}

// Reuses Our Philosophy's exact .phi-stat markup shape (data-count lives on
// .phi-stat-figure, not the outer .phi-stat) so panelReveal.js's
// animateStatCounter — which queries for that structure — works unmodified.
function specStatHTML(value, unit, label) {
  return (
    '<div class="phi-stat">' +
      '<span class="phi-stat-figure" data-count="' + value + '"><span class="phi-stat-value">0</span>' + (unit ? '<small>' + unit + '</small>' : '') + '</span>' +
      '<span class="phi-stat-label">' + label + '</span>' +
    '</div>'
  );
}

function renderDetailHTML(entry) {
  const { grid, feature } = galleryTilesFor(entry);
  const idPadded = String(entry.id).padStart(2, '0');
  const detailCount = grid.length + (feature ? 1 : 0);
  return (
    '<section class="detail-hero">' +
      '<p class="phi-eyebrow">Vertex Atelier — Build ' + idPadded + '/12</p>' +
      '<h1 class="detail-headline">' + entry.model + '<span class="detail-headline-sep"> // </span><span class="detail-headline-donor">' + entry.brand + ' ' + entry.donor + '</span></h1>' +
      /* is-revealed is static here, not scroll-toggled (this video plays
         directly in enterDetailView, above the fold) — it only exists so
         observeVideoLifecycle's resume-gate (below) lets this one auto-resume
         after being paused for scrolling out of view, same as Our
         Philosophy's hero video. */
      '<div class="detail-hero-media is-revealed">' +
        '<video muted loop playsinline autoplay preload="metadata" src="' + entry.videoUrl + '" poster="' + entry.posterUrl + '"></video>' +
        '<div class="detail-hero-scrim" aria-hidden="true"></div>' +
      '</div>' +
    '</section>' +
    '<section class="detail-overview">' +
      '<div class="detail-history">' +
        '<p class="phi-eyebrow">The Build</p>' +
        entry.backstory.map((p) => '<p class="phi-body phi-body--wide">' + p + '</p>').join('') +
      '</div>' +
      '<div class="detail-specs">' +
        '<p class="phi-eyebrow">Specification</p>' +
        '<div class="phi-stats">' +
          specStatHTML(entry.power, 'hp', 'Horsepower') +
          specStatHTML(entry.sprint, 's', '0–100 km/h') +
          specStatHTML(entry.topSpeed, 'km/h', 'Top speed') +
          specStatHTML(entry.weight, 'kg', 'Weight') +
        '</div>' +
        '<div class="detail-engine-row"><span class="detail-engine-label">Engine</span><span class="detail-engine-value">' + entry.engine + '</span></div>' +
      '</div>' +
    '</section>' +
    '<section class="detail-gallery">' +
      '<div class="phi-section-head"><span class="phi-eyebrow">Gallery</span><span class="phi-meta">' + detailCount + ' details shown</span></div>' +
      '<div class="detail-gallery-grid">' + grid.map(galleryTileHTML).join('') + '</div>' +
    '</section>' +
    (feature ? (
      '<section class="detail-feature">' +
        '<img class="detail-feature-img" src="' + feature.src + '" alt="" loading="lazy">' +
        '<div class="detail-feature-scrim" aria-hidden="true"></div>' +
        '<span class="detail-feature-caption">' + entry.brand + ' ' + entry.donor + ' — Detail</span>' +
      '</section>'
    ) : '')
  );
}

// Content is rebuilt from scratch on every open (innerHTML, not a persistent
// DOM reused across visits like Our Philosophy) — that's a deliberate
// simplification, not an oversight: fresh nodes start at their resting state
// (opacity:0, stat value "0") automatically, so "re-trigger every visit"
// falls out for free instead of needing an explicit reset pass first.
function enterDetailView(stage) {
  const root = stage.querySelector('[data-detail-scroll]');
  if (!root) return;
  root.scrollTop = 0;
  const heroVideo = root.querySelector('.detail-hero-media video');
  if (heroVideo) { heroVideo.currentTime = 0; heroVideo.play().catch(() => {}); }
  if (activeObserver) { activeObserver.disconnect(); activeObserver = null; }
  if (activeVideoLifecycle) { activeVideoLifecycle.disconnect(); activeVideoLifecycle = null; }
  const revealables = Array.from(root.querySelectorAll('.detail-gallery-tile, .detail-feature, [data-count]'));
  activeObserver = observeReveal(root, revealables);
  // Only the gallery/feature tiles can contain a <video> (stat figures never
  // do) — observeVideoLifecycle filters harmlessly either way, this just
  // avoids handing it elements it can never match. The hero media container
  // isn't in revealables (played directly above, not through observeReveal)
  // but still needs pause-when-offscreen/resume-when-back, hence added here
  // directly — its static is-revealed class (see renderDetailHTML) is what
  // lets the resume half actually take effect.
  const videoLifecycleEls = revealables.filter((el) => el.matches('.detail-gallery-tile, .detail-feature'));
  const heroMedia = root.querySelector('.detail-hero-media');
  if (heroMedia) videoLifecycleEls.push(heroMedia);
  activeVideoLifecycle = observeVideoLifecycle(root, videoLifecycleEls);
}

function leaveDetailView(stage) {
  if (activeObserver) { activeObserver.disconnect(); activeObserver = null; }
  if (activeVideoLifecycle) { activeVideoLifecycle.disconnect(); activeVideoLifecycle = null; }
  const root = stage.querySelector('[data-detail-scroll]');
  if (root) root.querySelectorAll('video').forEach((v) => { v.pause(); });
}

export function openCarDetail(stage, entry) {
  if (!entry) return;
  const view = stage.querySelector('[data-detail-view]');
  const content = stage.querySelector('[data-detail-content]');
  if (!view || !content) return;
  if (cleanupTimer) { clearTimeout(cleanupTimer); cleanupTimer = null; }
  content.innerHTML = renderDetailHTML(entry);
  isOpen = true;
  stage.classList.add('is-detail-view');
  view.setAttribute('aria-hidden', 'false');
  enterDetailView(stage);
}

export function isCarDetailOpen() { return isOpen; }

export function closeCarDetail(stage) {
  if (!isOpen) return;
  isOpen = false;
  leaveDetailView(stage);
  stage.classList.remove('is-detail-view');
  const view = stage.querySelector('[data-detail-view]');
  if (view) view.setAttribute('aria-hidden', 'true');
  const content = stage.querySelector('[data-detail-content]');
  // Delayed past the panel's own fade-out (--duration-base, 260ms) so
  // clearing the videos out from under the content doesn't cut the
  // transition short with a visible flash of empty black.
  cleanupTimer = setTimeout(() => { if (content) content.innerHTML = ''; }, 280);
}

// Only wires what's intrinsic to this page's own content (icons) — same
// split as consultationView.js's initConsultationView. The back button is
// wired in src/main.js instead, not here: closing this panel alone isn't
// enough, the WebGL grid also needs syncGridPause(stage, gridRef) to
// actually resume its render loop, and gridRef only exists in main.js's
// scope. Escape is centralized in src/main.js too — with the Consultation
// page now able to sit ABOVE this one (see css/webgl-grid.css's z-index
// note), two independent "if open, close" listeners on the same keydown
// event could both fire from a single Escape press and close both panels
// at once; main.js checks which one is actually topmost first.
export function initDetailView(stage) {
  const view = stage.querySelector('[data-detail-view]');
  if (!view) return;
  window.VertexIcons && window.VertexIcons.refresh(view);
  bindBackButtonScrollFade(view.querySelector('[data-detail-scroll]'), view.querySelector('[data-detail-back]'));
}
