/* Scroll-reveal + count-up shared by Our Philosophy (src/main.js) and the car
   detail page (src/detailView.js) — both are fixed/absolute panels with their
   OWN scrolling element, not the page (this stage doesn't page-scroll), and
   both must replay every visit, not just the first. Extracted here rather
   than duplicated a third time; js/reveal.js's animateNumber is deliberately
   NOT reused instead of this — that one roots against the page viewport and
   never resets after firing once, neither of which holds for either panel. */

const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function resetStatFigure(el) {
  const valueEl = el.querySelector('.phi-stat-value');
  if (valueEl) valueEl.textContent = '0';
}

export function animateStatCounter(el) {
  const raw = el.getAttribute('data-count');
  const target = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
  const valueEl = el.querySelector('.phi-stat-value');
  if (!valueEl || !isFinite(target)) return;
  if (PREFERS_REDUCED_MOTION) { valueEl.textContent = raw; return; }
  const decimals = (String(raw).split('.')[1] || '').length;
  const dur = 1200, t0 = performance.now();
  function frame(now) {
    const p = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    valueEl.textContent = (target * eased).toFixed(decimals);
    if (p < 1) requestAnimationFrame(frame);
    else valueEl.textContent = raw;
  }
  requestAnimationFrame(frame);
}

/* root: the panel's own scrolling element (IntersectionObserver root — these
   panels are fixed/absolute overlays, so the default page-viewport root would
   never fire). els: anything that should reveal on scroll — media tiles (get
   .is-revealed, and autoplay if they contain a <video>) and/or stat figures
   (get animateStatCounter if they carry data-count). Returns the observer so
   the caller can .disconnect() it on exit (each panel keeps one instance at a
   time, matching the existing Our Philosophy lifecycle).

   rootMargin expands the intersection box by 25% of the panel's own height
   on both edges, so a tile's entrance (and a video's first .play() call)
   starts slightly before it's actually scrolled into view rather than
   exactly on the frame it crosses the edge — enough head start for the
   browser to have a decoded frame ready instead of visibly popping in. */
export function observeReveal(root, els) {
  if (!els.length) return null;
  if (typeof IntersectionObserver !== 'function') {
    els.forEach((el) => {
      el.classList.add('is-revealed');
      const v = el.querySelector('video');
      if (v) v.play().catch(() => {});
      if (el.hasAttribute('data-count')) animateStatCounter(el);
    });
    return null;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-revealed');
      const video = el.querySelector('video');
      if (video) video.play().catch(() => {});
      if (el.hasAttribute('data-count')) animateStatCounter(el);
      observer.unobserve(el);
    });
  }, { root, threshold: 0.2, rootMargin: '25% 0px' });
  els.forEach((el) => observer.observe(el));
  return observer;
}

/* Companion to observeReveal, for stat figures specifically: replays the
   count-up every time the element re-enters view, not just once per panel
   visit. Deliberately a separate observer rather than dropping the
   observer.unobserve(el) from observeReveal above — a video tile or image
   silently re-fading in every time a scroll wiggle passes it would look
   glitchy, but a number counting up again on revisit is the actual point
   for a stat figure, not a bug to guard against. Same threshold/rootMargin
   as observeReveal so both fire at the same scroll position. */
export function observeStatCounters(root, els) {
  if (!els.length) return null;
  if (typeof IntersectionObserver !== 'function') {
    els.forEach((el) => animateStatCounter(el));
    return null;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) animateStatCounter(entry.target);
    });
  }, { root, threshold: 0.2, rootMargin: '25% 0px' });
  els.forEach((el) => observer.observe(el));
  return observer;
}

/* Companion to observeReveal above, for a longer-lived concern: once a tile
   has been revealed, its <video> just keeps looping forever, even scrolled
   far past — with up to 7 videos on Our Philosophy alone, that's several
   simultaneous decodes doing nothing for anyone. This is a SEPARATE observer
   (not folded into observeReveal's) because it never unobserves — it runs
   for the whole time the panel is open, continuously pausing a video once
   it scrolls well clear of the viewport and resuming it once back near,
   independent of the one-shot entrance/count-up logic above.

   containers, not <video> elements directly: each is checked for
   .is-revealed before resuming playback, so this never plays a video ahead
   of its own entrance transition — observeReveal above is still what
   triggers the FIRST play, at its own (tighter) threshold. A wide rootMargin
   (50% of the panel's height past each edge) avoids pause/resume thrashing
   from small scroll jitters right at the boundary. */
export function observeVideoLifecycle(root, containers) {
  const withVideo = containers.filter((el) => el.querySelector('video'));
  if (!withVideo.length || typeof IntersectionObserver !== 'function') return null;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target.querySelector('video');
      if (!video) return;
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('is-revealed')) video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { root, threshold: 0, rootMargin: '50% 0px' });
  withVideo.forEach((el) => observer.observe(el));
  return observer;
}
