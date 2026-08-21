import { initWebGLGrid } from './scene.js';
import { FLEET_DATA } from './fleetData.js';
import { openCarDetail, closeCarDetail, initDetailView, isCarDetailOpen } from './detailView.js';
import { openConsultation, closeConsultation, initConsultationView, isConsultationOpen } from './consultationView.js';
import { resetStatFigure, animateStatCounter, observeReveal, observeVideoLifecycle } from './panelReveal.js';

// The 3D grid must render whenever any part of it could still be visible —
// including List View, which deliberately shows it blurred behind frosted
// glass (see css/webgl-grid.css) — but NOT during Our Philosophy, a car
// detail page, or the Consultation page, all solid backgrounds that cover it
// completely. Called after every navigation rather than threading
// pause()/resume() calls through each handler individually: cheaper to
// assert the correct end state once than to reason about which specific
// transition changed it, and both scene.js methods are already idempotent
// no-ops if the state doesn't actually change.
function syncGridPause(stage, gridRef) {
  if (!gridRef.current) return;
  const shouldPause = stage.classList.contains('is-philosophy-view') || isCarDetailOpen() || isConsultationOpen();
  if (shouldPause) gridRef.current.pause();
  else gridRef.current.resume();
}

/* Bootstraps the fullscreen WebGL portfolio grid and its floating chrome — the
   entire landing page for any WebGL-capable visitor. Runs as a module script,
   after the classic js/*.js scripts (see index.html load order); js/main.js
   left #siteFallback untouched and hidden if window.__vertexWebGL (set inline
   in <head>) looked true. This module is what actually confirms that by trying
   to stand the scene up, and calls window.VertexActivateFallback() — defined in
   js/main.js, renders and reveals the full 2D site — as a rescue path if real
   initialisation fails despite the feature-detect passing (e.g. context created
   but a driver rejects a shader). */

function initChrome(stage, gridRef) {
  const chrome = stage.querySelector('.webgl-chrome');
  if (!chrome) return;

  // js/icons.js only ever gets called from #siteFallback's activateFallback();
  // nothing else renders the WebGL chrome's own [data-lucide] icons (the
  // Filter pill's icon-only sliders glyph, for one), so do it here once
  // lucide has loaded from the CDN.
  window.VertexIcons && window.VertexIcons.refresh(chrome);

  chrome.querySelectorAll('[data-dummy]').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); });
  });

  // gridRef.current is filled in by boot() once initWebGLGrid() resolves —
  // initChrome() runs before that promise settles, so this stays a live
  // lookup rather than closing over the handle directly.
  const brand = chrome.querySelector('[data-reset-camera]');
  if (brand) {
    brand.addEventListener('click', (e) => {
      e.preventDefault();
      closeCarDetail(stage); // "reset view to home" should also back out of any open car detail
      closeConsultation(stage);
      syncGridPause(stage, gridRef);
      gridRef.current && gridRef.current.resetView();
    });
  }

  const soundToggle = chrome.querySelector('[data-sound-toggle]');
  if (soundToggle) {
    // Created but never auto-played — aria-pressed="false" on load (see
    // index.html) is the actual autoplay-policy compliance: play() only ever
    // runs from inside this click handler, i.e. a real user gesture.
    const audio = new Audio('/audio/background-music.mp3');
    audio.loop = true;
    audio.volume = 0.3;

    soundToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const turningOn = soundToggle.getAttribute('aria-pressed') !== 'true';
      const label = soundToggle.querySelector('[data-sound-label]');
      soundToggle.setAttribute('aria-pressed', String(turningOn));
      label.textContent = turningOn ? 'ON' : 'OFF';
      if (turningOn) {
        audio.play().catch(() => {
          // Rejected despite the user gesture (e.g. no decodable source) —
          // don't leave the UI claiming sound is on when nothing is playing.
          soundToggle.setAttribute('aria-pressed', 'false');
          label.textContent = 'OFF';
        });
      } else {
        audio.pause();
      }
    });
  }

  // Section tabs: Fleet <-> Our Philosophy. Mutually exclusive with the mode
  // toggle below by construction — .webgl-philosophy-view sits at the same
  // z-index tier as .webgl-list-view and fully covers it, so switching to
  // "Our Philosophy" doesn't need to touch the mode toggle's own state at
  // all; switching back to "Fleet" just reveals whatever mode (3D/list) was
  // already showing underneath. The car detail page sits ABOVE this whole
  // tier (see css/webgl-grid.css), so an explicit section switch must also
  // close it first, or it'd be left stranded covering whichever section the
  // tabs just switched to underneath it.
  const sectionTabs = chrome.querySelectorAll('[data-section-tab]');
  const philosophyView = stage.querySelector('[data-philosophy-view]');
  sectionTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      closeCarDetail(stage);
      closeConsultation(stage);
      const section = tab.getAttribute('data-section-tab');
      sectionTabs.forEach((t) => { t.classList.remove('is-active'); t.setAttribute('aria-pressed', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-pressed', 'true');
      stage.classList.toggle('is-philosophy-view', section === 'philosophy');
      if (philosophyView) philosophyView.setAttribute('aria-hidden', String(section !== 'philosophy'));
      if (section === 'philosophy') enterPhilosophyView(stage);
      else leavePhilosophyView(stage);
      syncGridPause(stage, gridRef);
    });
  });

  // Bottom-left mode toggle: 3D Fleet <-> List View. Unlike the section tabs
  // above, this one has a real second surface behind it (.webgl-list-view),
  // faded in/out via .is-list-view on .webgl-stage (css/webgl-grid.css).
  const modeButtons = chrome.querySelectorAll('[data-mode-toggle]');
  const listView = stage.querySelector('[data-list-view]');
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCarDetail(stage); // same reasoning as the section tabs above
      closeConsultation(stage);
      const mode = btn.getAttribute('data-mode-toggle');
      modeButtons.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      stage.classList.toggle('is-list-view', mode === 'list');
      if (listView) listView.setAttribute('aria-hidden', String(mode !== 'list'));
      syncGridPause(stage, gridRef); // closeCarDetail above may have just closed a detail page — resume if so
    });
  });

  // Header's "Request a build slot" pill: opens the Consultation page.
  // Reachable from any view (it's part of the persistent chrome, always
  // visible), which is exactly why Consultation itself doesn't need to
  // close whatever's currently open first — it just covers it (see its
  // z-index note in css/webgl-grid.css).
  const openConsultationBtn = chrome.querySelector('[data-open-consultation]');
  if (openConsultationBtn) {
    openConsultationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openConsultation(stage);
      syncGridPause(stage, gridRef);
    });
  }

  // Consultation's own "Return to fleet" back button: unlike the car detail
  // page's back button (which only ever needs to reveal whatever was
  // directly behind it), this one is reachable from literally any view, and
  // its label is a promise — clicking it should always land on Fleet, not
  // "whatever was open before," so it also closes a car detail page and
  // forces the Fleet section tab if Our Philosophy was showing underneath.
  const consultationBackBtn = stage.querySelector('[data-consultation-back]');
  if (consultationBackBtn) {
    consultationBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeConsultation(stage);
      closeCarDetail(stage);
      const fleetTab = chrome.querySelector('[data-section-tab="fleet"]');
      if (fleetTab && !fleetTab.classList.contains('is-active')) fleetTab.click(); // click(), not a manual state copy — reuses the section-tab handler's own enter/leave + syncGridPause logic
      else syncGridPause(stage, gridRef);
    });
  }

  // Footer's Fleet / Our Philosophy links (inside .webgl-philosophy-view,
  // populated below) just delegate to the real section tabs above rather
  // than duplicating the switch-view logic.
  stage.querySelectorAll('[data-footer-section]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = chrome.querySelector('[data-section-tab="' + link.getAttribute('data-footer-section') + '"]');
      if (target) target.click();
    });
  });

  const hhEl = chrome.querySelector('[data-clock-hh]');
  const mmEl = chrome.querySelector('[data-clock-mm]');
  if (hhEl && mmEl) {
    // Written into their own spans, not the shared strong's textContent, so
    // the blinking colon between them (css/webgl-grid.css) survives each tick.
    const update = () => {
      const now = new Date();
      hhEl.textContent = String(now.getHours()).padStart(2, '0');
      mmEl.textContent = String(now.getMinutes()).padStart(2, '0');
    };
    update();
    setInterval(update, 15000);
  }

  populateListView(stage, gridRef);
  initDetailView(stage);
  initConsultationView(stage);

  // Centralized Escape handling for both overlay panels — see the comment
  // in detailView.js's initDetailView for why this isn't two independent
  // per-view listeners: Consultation sits above the car detail page, so a
  // single Escape press should close only the topmost open one.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (isConsultationOpen()) closeConsultation(stage);
    else if (isCarDetailOpen()) closeCarDetail(stage);
  });
}

// Retriggers the hero text/video entrance animation (css/webgl-grid.css
// .phi-animate-in) on every visit to the section, not just the first — a
// class that's already present when re-added doesn't restart a CSS
// animation, so this removes it, forces a reflow to flush that removal, then
// re-adds it in the same tick.
function replayHeroEntrance(philosophyView) {
  const hero = philosophyView.querySelector('.phi-hero');
  if (!hero) return;
  hero.classList.remove('phi-animate-in');
  void hero.offsetWidth; // reflow — without this the remove+add would coalesce and the browser would never see the "off" state
  hero.classList.add('phi-animate-in');
}

// Two IntersectionObserver instances for the whole panel at a time, rebuilt
// on every entry (see enterPhilosophyView) — holding module-level references
// is what lets us .disconnect() the previous ones instead of stacking fresh
// observers on the same elements every time the user re-opens the section.
let philosophyObserver = null;
let philosophyVideoLifecycle = null;

// Called once per visit to Our Philosophy (from the section-tab handler).
// Resets every replayable element back to its "not yet entered" state, then
// re-observes all of it against .phi-scroll (the panel's own scrolling
// element — this stage is otherwise fixed/non-scrolling, so the default
// viewport root would never fire). Media reveals + autoplays + (for stats)
// counts up the instant it crosses into view; the hero block is above the
// fold and uses the separate .phi-animate-in keyframe system instead, so it's
// excluded here and handled directly.
function enterPhilosophyView(stage) {
  const philosophyView = stage.querySelector('[data-philosophy-view]');
  if (!philosophyView) return;

  replayHeroEntrance(philosophyView);
  const heroVideo = philosophyView.querySelector('.phi-hero-video video');
  if (heroVideo) { heroVideo.currentTime = 0; heroVideo.play().catch(() => {}); }

  const mediaEls = philosophyView.querySelectorAll('.phi-video-tile, .phi-reveal-media, .phi-reveal-img');
  const statEls = philosophyView.querySelectorAll('[data-count]');
  mediaEls.forEach((el) => el.classList.remove('is-revealed'));
  statEls.forEach(resetStatFigure);

  if (philosophyObserver) { philosophyObserver.disconnect(); philosophyObserver = null; }
  if (philosophyVideoLifecycle) { philosophyVideoLifecycle.disconnect(); philosophyVideoLifecycle = null; }

  const root = stage.querySelector('.phi-scroll');
  if (!root) return;
  philosophyObserver = observeReveal(root, [...mediaEls, ...statEls]);
  // mediaEls includes .phi-reveal-img (plain images, no <video>) — harmless,
  // observeVideoLifecycle filters those out itself. The hero video isn't in
  // mediaEls (it's above the fold and played directly above, not through the
  // scroll-reveal system) but still needs pausing once scrolled out of view
  // and resuming when scrolled back — its static is-revealed class (see
  // index.html) is what lets that resume actually happen.
  const heroVideoContainer = philosophyView.querySelector('.phi-hero-video');
  philosophyVideoLifecycle = observeVideoLifecycle(root, heroVideoContainer ? [...mediaEls, heroVideoContainer] : [...mediaEls]);
}

// Called when navigating away from Our Philosophy. Pauses and rewinds every
// video (not just the ones that happened to reveal) so nothing keeps
// decoding while hidden, and so the next entrance is a genuine replay from
// the start rather than resuming wherever playback left off.
function leavePhilosophyView(stage) {
  const philosophyView = stage.querySelector('[data-philosophy-view]');
  if (!philosophyView) return;
  philosophyView.querySelectorAll('video').forEach((v) => { v.pause(); v.currentTime = 0; });
  if (philosophyObserver) { philosophyObserver.disconnect(); philosophyObserver = null; }
  if (philosophyVideoLifecycle) { philosophyVideoLifecycle.disconnect(); philosophyVideoLifecycle = null; }
}

// Called by src/scene.js on a 3D card click — cardIndex is a position in the
// FLEET_DATA array (from the raycast hit's tiled slot), not a FLEET_DATA id.
function onCardActivate(stage, gridRef, cardIndex) {
  openCarDetail(stage, FLEET_DATA[cardIndex]);
  syncGridPause(stage, gridRef);
}

// Called by a List View row click — carId is a FLEET_DATA id (string), since
// list rows aren't tied to a raycastable mesh the way 3D cards are.
function onSelectCar(stage, gridRef, carId) {
  openCarDetail(stage, FLEET_DATA.find((entry) => entry.id === carId));
  syncGridPause(stage, gridRef);
}

function buildListRowHTML(entry, index) {
  return (
    '<button type="button" class="webgl-list-row" data-list-row data-car-id="' + entry.id + '">' +
      '<span class="webgl-list-index">' + String(index + 1).padStart(2, '0') + '</span>' +
      '<span class="webgl-list-brand">' + entry.brand + '</span>' +
      '<span class="webgl-list-model">' + entry.model + '</span>' +
      '<svg class="webgl-list-arrow" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
    '</button>'
  );
}

function populateListView(stage, gridRef) {
  const body = stage.querySelector('[data-list-body]');
  const count = stage.querySelector('[data-list-count]');
  if (!body) return;
  body.innerHTML = FLEET_DATA.map(buildListRowHTML).join('');
  if (count) count.textContent = FLEET_DATA.length + ' builds';
  body.addEventListener('click', (e) => {
    const row = e.target.closest && e.target.closest('[data-list-row]');
    if (!row) return;
    onSelectCar(stage, gridRef, row.getAttribute('data-car-id'));
  });
}

async function boot() {
  const stage = document.getElementById('webglStage');
  if (!stage) return;
  const gridRef = { current: null };
  initChrome(stage, gridRef);

  if (!window.__vertexWebGL) {
    return; // js/main.js already activated the 2D fallback for this case
  }

  const canvas = stage.querySelector('#webglCanvas');
  try {
    const handle = await initWebGLGrid(stage, (cardIndex) => onCardActivate(stage, gridRef, cardIndex));
    if (!handle) throw new Error('WebGLRenderer failed to initialise');
    gridRef.current = handle;
    // Only now — confirmed rendering, not just feature-detected — does the
    // canvas and chrome reveal themselves (chrome via the :not(.is-webgl-active)
    // rule in css/webgl-grid.css), so a mid-init failure never leaves a blank
    // or broken canvas visible, nor floating buttons hovering over one.
    canvas.hidden = false;
    stage.classList.add('is-webgl-active');
  } catch (err) {
    console.warn('[vertex] WebGL grid failed to start, falling back to the full 2D site.', err);
    canvas.hidden = true;
    stage.classList.remove('is-webgl-active');
    if (window.VertexActivateFallback) window.VertexActivateFallback();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
