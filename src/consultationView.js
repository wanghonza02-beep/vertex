import { observeReveal, resetStatFigure } from './panelReveal.js';

/* "Commission Your Legacy" — the Private Atelier Consultation page. Opened
   from the header's "Request a build slot" pill, reachable from ANY other
   view (see css/webgl-grid.css for why it sits at the highest content
   z-index, 9). Static markup — like Our Philosophy, not per-item data like
   a car detail page — so this resets and re-observes the SAME persistent
   DOM on every open rather than rebuilding it (see enterConsultationView).
   src/main.js owns the back button and Escape handling (it needs the fuller
   "actually return all the way to Fleet" reset, not just "close this one
   panel"), and calls openConsultation/closeConsultation here. */

let isOpen = false;
let revealObserver = null;

// Same remove/reflow/re-add restart trick as src/main.js's
// replayHeroEntrance for Our Philosophy — a class already present when
// re-added doesn't restart a CSS animation.
function replayHeroEntrance(view) {
  const hero = view.querySelector('.consultation-hero');
  if (!hero) return;
  hero.classList.remove('consultation-animate-in');
  void hero.offsetWidth; // reflow — flushes the removal before re-adding in the same tick
  hero.classList.add('consultation-animate-in');
}

function enterConsultationView(stage) {
  const view = stage.querySelector('[data-consultation-view]');
  const root = stage.querySelector('[data-consultation-scroll]');
  if (!view || !root) return;
  root.scrollTop = 0;
  replayHeroEntrance(view);

  const revealEls = view.querySelectorAll(
    '.consultation-card, .consultation-quote, .consultation-notice, .consultation-field, .consultation-cta-row'
  );
  // [data-count] is the $2,000 fee metric (.consultation-quote-amount) —
  // same data-count/.phi-stat-value shape Our Philosophy's stats use (see
  // src/main.js's enterPhilosophyView), reusing animateStatCounter
  // unmodified via observeReveal below rather than a page-specific counter.
  const statEls = view.querySelectorAll('[data-count]');
  revealEls.forEach((el) => el.classList.remove('is-revealed'));
  statEls.forEach(resetStatFigure);

  if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
  revealObserver = observeReveal(root, [...Array.from(revealEls), ...Array.from(statEls)]);
}

function leaveConsultationView() {
  if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
}

export function isConsultationOpen() { return isOpen; }

export function openConsultation(stage) {
  const view = stage.querySelector('[data-consultation-view]');
  if (!view) return;
  isOpen = true;
  stage.classList.add('is-consultation-view');
  view.setAttribute('aria-hidden', 'false');
  enterConsultationView(stage);
}

export function closeConsultation(stage) {
  if (!isOpen) return;
  isOpen = false;
  leaveConsultationView();
  stage.classList.remove('is-consultation-view');
  const view = stage.querySelector('[data-consultation-view]');
  if (view) view.setAttribute('aria-hidden', 'true');
}

// No real backend — same simulated-delay + toast pattern as js/form.js's
// inquiry form, reusing its existing window.VertexToast rather than a
// second toast implementation.
function handleSubmit(form) {
  const submitBtn = form.querySelector('[data-consultation-submit]');
  if (!submitBtn) return;
  const original = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting…';
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = original;
    form.reset();
    window.VertexToast && window.VertexToast.show(
      'Application received — our concierge team will follow up within two business days.',
      'success'
    );
  }, 900);
}

// Wires only what's intrinsic to this page's own content (icons, the form).
// The back button and Escape key are wired in src/main.js — see the header
// comment above for why.
export function initConsultationView(stage) {
  const view = stage.querySelector('[data-consultation-view]');
  if (!view) return;
  window.VertexIcons && window.VertexIcons.refresh(view);
  const form = view.querySelector('[data-consultation-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;
      handleSubmit(form);
    });
  }
}
