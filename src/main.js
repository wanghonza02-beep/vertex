import { initWebGLGrid } from './scene.js';
import { FLEET_DATA } from './fleetData.js';
import { openCarDetail, closeCarDetail, initDetailView, isCarDetailOpen } from './detailView.js';
import { openConsultation, closeConsultation, initConsultationView, isConsultationOpen } from './consultationView.js';
import { openLegal, closeLegal, initLegalView, isLegalOpen } from './legalView.js';
import { resetStatFigure, observeReveal, observeStatCounters, observeVideoLifecycle } from './panelReveal.js';
import { supabase } from './supabaseClient.js';

// The 3D grid must render whenever any part of it could still be visible —
// including List View, which deliberately shows it blurred behind frosted
// glass (see css/webgl-grid.css) — but NOT during Our Philosophy, a car
// detail page, the Consultation page, or a legal page, all solid
// backgrounds that cover it completely. Called after every navigation
// rather than threading pause()/resume() calls through each handler
// individually: cheaper to assert the correct end state once than to
// reason about which specific transition changed it, and both scene.js
// methods are already idempotent no-ops if the state doesn't actually
// change.
function syncGridPause(stage, gridRef) {
  if (!gridRef.current) return;
  const shouldPause = stage.classList.contains('is-philosophy-view') || isCarDetailOpen() || isConsultationOpen() || isLegalOpen();
  if (shouldPause) gridRef.current.pause();
  else gridRef.current.resume();
}

// Touch/no-hover devices (phones, and touch tablets) — not a width check, so
// rotating to landscape doesn't lift the restriction below. Reused wherever
// "mobile" decisions need a single source of truth: List View is the only
// mode these devices default to and can reach (3D Fleet is desktop-only —
// see the mode-toggle handler in initChrome).
const MOBILE_QUERY = '(hover: none), (pointer: coarse)';
function isMobileDevice() {
  return window.matchMedia(MOBILE_QUERY).matches;
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
      // Unlike every other back action on this page (which reveals
      // whatever view was directly behind the one being closed — see the
      // Consultation/Legal back button comments below), the logo is a
      // literal "take me home" control: it MUST always land on the primary
      // landing page (Fleet, 3D grid), regardless of what was open or which
      // section/mode was active. fleetTab.click()/gridBtn.click() reuse
      // their own handlers' close-everything-and-switch logic rather than
      // duplicating it here; closeCarDetail/closeConsultation/closeLegal
      // still run directly after in case one of those tabs was already
      // marked active and so never fired (e.g. Consultation opened while
      // already on Fleet+Grid).
      const fleetTab = chrome.querySelector('[data-section-tab="fleet"]');
      if (fleetTab && !fleetTab.classList.contains('is-active')) fleetTab.click();
      const gridBtn = chrome.querySelector('[data-mode-toggle="grid"]');
      if (gridBtn && !gridBtn.classList.contains('is-active')) gridBtn.click();
      closeCarDetail(stage);
      closeConsultation(stage);
      closeLegal(stage);
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
      closeLegal(stage);
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

  // Mobile always starts in — and the "3D Fleet" button below can never
  // leave — List View: the interactive orbit/drag grid is a desktop-only
  // experience, though the same canvas keeps rendering underneath as a
  // blurred ambient backdrop (see .webgl-list-view's backdrop-filter and
  // syncGridPause above, which never pauses for List View). Set directly
  // rather than via modeButtons[i].click() — nothing else is open yet at
  // boot, so there's no other panel-closing/pause work the click handler
  // below would otherwise need to do.
  if (isMobileDevice()) {
    modeButtons.forEach((b) => {
      const isList = b.getAttribute('data-mode-toggle') === 'list';
      b.classList.toggle('is-active', isList);
      b.setAttribute('aria-pressed', String(isList));
    });
    stage.classList.add('is-list-view');
    if (listView) listView.setAttribute('aria-hidden', 'false');
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = btn.getAttribute('data-mode-toggle');
      // "3D Fleet" stays visible on mobile (so the option is legible, not
      // just missing) but tapping it never actually switches modes — a
      // toast explains why instead. List View's own button is unaffected,
      // since that's the one mode mobile can already reach.
      if (mode === 'grid' && isMobileDevice()) {
        window.VertexToast && window.VertexToast.show(
          'EXCLUSIVELY FOR DESKTOP — Please open Vertex on a desktop browser to experience interactive 3D Fleet exploration.',
          'neutral'
        );
        return;
      }
      closeCarDetail(stage); // same reasoning as the section tabs above
      closeConsultation(stage);
      closeLegal(stage);
      modeButtons.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      stage.classList.toggle('is-list-view', mode === 'list');
      if (listView) listView.setAttribute('aria-hidden', String(mode !== 'list'));
      syncGridPause(stage, gridRef); // closeCarDetail above may have just closed a detail page — resume if so
    });
  });

  // Header's "Acquire or Commission" pill: opens the Consultation page.
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

  // Consultation's own back button: reveals whatever was directly behind
  // it — same, simpler pattern as the car detail page's back button below,
  // NOT the old "always force Fleet" behavior. Opening Consultation never
  // touches Our Philosophy's or a car detail page's own state (it just
  // covers them — see the z-index note in css/webgl-grid.css), so that
  // state is still sitting there untouched underneath; closing Consultation
  // alone is enough for it to reappear correctly. This matters specifically
  // for footer-triggered opens (Our Philosophy's footer link opens
  // Consultation without leaving Philosophy) — forcing Fleet here would
  // strand the visitor somewhere they never asked to go.
  const consultationBackBtn = stage.querySelector('[data-consultation-back]');
  if (consultationBackBtn) {
    consultationBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeConsultation(stage);
      syncGridPause(stage, gridRef);
    });
  }

  // Footer's Fleet / Our Philosophy links (inside .webgl-philosophy-view and
  // .webgl-consultation-view, populated below) just delegate to the real
  // section tabs above rather than duplicating the switch-view logic.
  stage.querySelectorAll('[data-footer-section]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = chrome.querySelector('[data-section-tab="' + link.getAttribute('data-footer-section') + '"]');
      if (target) target.click();
    });
  });

  // Footer's "Acquire or Commission" link: same open logic as the header
  // pill above, just a distinct attribute (data-open-consultation is
  // queried with chrome.querySelector — singular, scoped to .webgl-chrome —
  // so a second element carrying that same attribute outside the chrome
  // would silently never get wired here).
  stage.querySelectorAll('[data-footer-open-consultation]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openConsultation(stage);
      syncGridPause(stage, gridRef);
    });
  });

  // Footer newsletter forms (one per footer instance — Our Philosophy and
  // Consultation each have their own copy of the same markup). No real
  // backend, same simulated-delay + toast pattern as the consultation form
  // itself (src/consultationView.js) and the old inquiry form (js/form.js),
  // reusing the existing window.VertexToast rather than a third
  // implementation of the same confirmation UI.
  // Inserts straight into Supabase's newsletter_subscribers table from the
  // browser using the anon key — that table's RLS only grants insert (see
  // supabase/schema.sql), so this can add a row but never read one back.
  // Falls back to the old simulated-delay + toast demo when Supabase isn't
  // configured yet, so the footer form never looks broken either way.
  stage.querySelectorAll('[data-newsletter-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const emailInput = form.querySelector('input[name="email"]');
      const email = emailInput ? emailInput.value.trim() : '';
      if (btn) btn.disabled = true;

      const finish = (message, type) => {
        if (btn) btn.disabled = false;
        window.VertexToast && window.VertexToast.show(message, type);
      };

      if (!supabase) {
        setTimeout(() => { form.reset(); finish('You\'re on the list — we\'ll be in touch.', 'success'); }, 700);
        return;
      }

      supabase.from('newsletter_subscribers').insert({ email }).then(({ error }) => {
        if (error) {
          // 23505 = unique_violation — already subscribed reads as success
          // to the visitor, not an error; anything else is a real failure.
          if (error.code === '23505') { form.reset(); finish('You\'re already on the list.', 'success'); return; }
          console.error('Newsletter signup failed:', error);
          finish('Something went wrong — please try again.', 'error');
          return;
        }
        form.reset();
        finish('You\'re on the list — we\'ll be in touch.', 'success');
      });
    });
  });

  // Footer's Privacy Policy / Terms of Service / Cookie Settings links
  // (both footer instances carry all three) open the matching legal page.
  // Doesn't close whatever's currently open first — it just covers it,
  // same reasoning as the Consultation pill above (including when that
  // "whatever" is Consultation itself, opened from ITS OWN footer).
  stage.querySelectorAll('[data-legal-page]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openLegal(stage, link.getAttribute('data-legal-page'));
      syncGridPause(stage, gridRef);
    });
  });

  // Legal page's own "Back" button: reveals whatever was directly behind
  // it — same reasoning as Consultation's back button above, not the old
  // "always force Fleet" behavior. A legal page can be opened from Our
  // Philosophy's footer OR from inside an open Consultation page (its
  // footer carries the same three links); either way, opening it never
  // touched what was underneath, so closing it alone is enough to correctly
  // land back on Consultation, Our Philosophy, or Fleet — whichever it
  // actually was.
  const legalBackBtn = stage.querySelector('[data-legal-back]');
  if (legalBackBtn) {
    legalBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeLegal(stage);
      syncGridPause(stage, gridRef);
    });
  }

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
  initLegalView(stage);

  // Our Philosophy's footer icons (send/instagram): unlike the
  // Consultation and detail views, nothing else ever refreshes icons inside
  // .webgl-philosophy-view — its old footer was plain text, not icon-based,
  // so this never mattered before. Static content, not per-visit, so this
  // runs once at boot rather than on every enterPhilosophyView() call.
  const philosophyViewEl = stage.querySelector('[data-philosophy-view]');
  if (philosophyViewEl) window.VertexIcons && window.VertexIcons.refresh(philosophyViewEl);

  // Car detail page's own "Back to fleet" button: wired here (not inside
  // detailView.js's initDetailView, which only has stage, not gridRef) for
  // the same reason the consultation back button above is — closing the
  // panel alone leaves the grid paused forever, since syncGridPause is what
  // actually restarts scene.js's render loop. This was the missing call
  // behind the WebGL canvas permanently freezing after returning from any
  // car detail page: closeCarDetail() only ever toggled is-detail-view off;
  // nothing downstream of that ever called resume() on the grid handle.
  const detailBackBtn = stage.querySelector('[data-detail-back]');
  if (detailBackBtn) {
    detailBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCarDetail(stage);
      syncGridPause(stage, gridRef);
    });
  }

  // Centralized Escape handling for all three overlay panels — see the
  // comment in detailView.js's initDetailView for why this isn't three
  // independent per-view listeners: a legal page can sit above Consultation
  // (opened from its footer), which can itself sit above a car detail page,
  // so a single Escape press should close only the topmost open one —
  // checked in that same top-to-bottom order. Same syncGridPause gap as the
  // back buttons above applied here too — Escape out of any of these left
  // the grid paused with nothing left to ever resume it.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (isLegalOpen()) { closeLegal(stage); syncGridPause(stage, gridRef); }
    else if (isConsultationOpen()) { closeConsultation(stage); syncGridPause(stage, gridRef); }
    else if (isCarDetailOpen()) { closeCarDetail(stage); syncGridPause(stage, gridRef); }
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

// Three IntersectionObserver instances for the whole panel at a time,
// rebuilt on every entry (see enterPhilosophyView) — holding module-level
// references is what lets us .disconnect() the previous ones instead of
// stacking fresh observers on the same elements every time the user
// re-opens the section.
let philosophyObserver = null;
let philosophyStatObserver = null;
let philosophyVideoLifecycle = null;

// Called once per visit to Our Philosophy (from the section-tab handler).
// Resets every replayable element back to its "not yet entered" state, then
// re-observes all of it against .phi-scroll (the panel's own scrolling
// element — this stage is otherwise fixed/non-scrolling, so the default
// viewport root would never fire). Media reveals + autoplays the instant it
// crosses into view, once per visit (observeReveal); stats count up every
// time they cross into view, including scrolling past and back within the
// SAME visit (observeStatCounters) — a video tile silently re-fading in on
// every scroll wiggle would look glitchy, but a number counting up again on
// revisit is the actual ask, not a bug to guard against. The hero block is
// above the fold and uses the separate .phi-animate-in keyframe system
// instead, so it's excluded here and handled directly.
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
  if (philosophyStatObserver) { philosophyStatObserver.disconnect(); philosophyStatObserver = null; }
  if (philosophyVideoLifecycle) { philosophyVideoLifecycle.disconnect(); philosophyVideoLifecycle = null; }

  const root = stage.querySelector('.phi-scroll');
  if (!root) return;
  philosophyObserver = observeReveal(root, [...mediaEls]);
  philosophyStatObserver = observeStatCounters(root, [...statEls]);
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
  if (philosophyStatObserver) { philosophyStatObserver.disconnect(); philosophyStatObserver = null; }
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

// Always wait for the DOMContentLoaded EVENT — never shortcut on
// document.readyState. This file is a type="module" script, which (like a
// classic <script defer>) only ever starts running once parsing is already
// done, so readyState is ALREADY 'interactive' by the time this line runs,
// every single time, regardless of where this script sits relative to
// others. Checking readyState here can never catch the "still loading" case
// it was written for, so it always fell through to calling boot()
// immediately — fine in dev, where Vite serves this script in the same
// position it has in source (after the legacy js/*.js <script defer> tags
// that define window.VertexIcons/VertexToast), but broken in a production
// build, where Vite hoists the bundled module script up into <head>, well
// before those. DOMContentLoaded is the one checkpoint the platform
// guarantees fires only once EVERY deferred/module script (this one and
// all the legacy ones, in whatever order the page actually has them) has
// already finished running — so listening for it unconditionally is
// correct regardless of tag order, immune to however a future build
// happens to arrange these scripts.
document.addEventListener('DOMContentLoaded', boot);
