/* The fleet's drag-to-scroll carousel. Pointer Events unify mouse/touch/pen so the
   same code drives desktop drag and mobile swipe. The track is moved with a manual
   transform (not native scrollLeft) so momentum, rubber-band overscroll and snap can
   all be hand-tuned — the same approach libraries like Embla/Swiper use internally,
   chosen here so it stays a small, dependency-free file instead of adding one. */
(function () {
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function rubberband(v, lo, hi) {
    if (v > hi) return hi + (v - hi) / 3;
    if (v < lo) return lo + (v - lo) / 3;
    return v;
  }

  function initDragCarousel(opts) {
    const viewport = opts.viewport;
    const track = opts.track;
    const progressFill = opts.progressFill;
    const prevBtn = opts.prevBtn;
    const nextBtn = opts.nextBtn;

    let x = 0;
    let minX = 0;
    const maxX = 0;
    let dragging = false;
    let captured = false;
    let pointerId = null;
    let startX = 0, startTranslate = 0;
    let lastX = 0, lastT = 0, velocity = 0;
    let moved = 0;
    let momentumRaf = null;
    let cardStep = 320;

    function measure() {
      const trackW = track.scrollWidth;
      const viewW = viewport.clientWidth;
      minX = Math.min(0, viewW - trackW);
      const firstCard = track.querySelector('.build-card');
      if (firstCard) {
        const style = getComputedStyle(track);
        const gap = parseFloat(style.columnGap || style.gap || '32') || 32;
        cardStep = firstCard.getBoundingClientRect().width + gap;
      }
      setX(clamp(x, minX, maxX));
    }

    function setX(v) {
      x = v;
      track.style.transform = 'translate3d(' + v + 'px,0,0)';
      const progress = minX === 0 ? 0 : clamp(v / minX, 0, 1);
      if (progressFill) progressFill.style.transform = 'scaleX(' + progress + ')';
      if (prevBtn) prevBtn.disabled = v >= -1;
      if (nextBtn) nextBtn.disabled = v <= minX + 1;
    }

    function cancelMomentum() {
      if (momentumRaf) cancelAnimationFrame(momentumRaf);
      momentumRaf = null;
    }

    function animateTo(target) {
      cancelMomentum();
      target = clamp(target, minX, maxX);
      if (Math.abs(target - x) < 0.5) { setX(target); track.style.willChange = ''; return; }
      const start = x, dist = target - start, dur = 420, t0 = performance.now();
      function frame(now) {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setX(start + dist * eased);
        if (p < 1) momentumRaf = requestAnimationFrame(frame);
        else track.style.willChange = '';
      }
      momentumRaf = requestAnimationFrame(frame);
    }

    function snapToNearest() {
      animateTo(Math.round(x / cardStep) * cardStep);
    }

    function settleWithMomentum() {
      let v = velocity * 16;
      const friction = 0.92;
      if (Math.abs(v) <= 0.4) { snapToNearest(); return; }
      function step() {
        v *= friction;
        let next = x + v;
        if (next > maxX || next < minX) v *= 0.55;
        next = clamp(next, minX - 60, maxX + 60);
        setX(next);
        if (Math.abs(v) > 0.4 && next > minX - 55 && next < maxX + 55) {
          momentumRaf = requestAnimationFrame(step);
        } else {
          snapToNearest();
        }
      }
      momentumRaf = requestAnimationFrame(step);
    }

    function onPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true;
      captured = false;
      pointerId = e.pointerId;
      moved = 0;
      startX = e.clientX;
      startTranslate = x;
      lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      cancelMomentum();
      // Pointer capture is NOT taken here. Capturing on every press — even a plain
      // click with zero movement — was found (via real browser testing) to suppress
      // the native 'click' event's normal bubble/targeting in Chromium, which broke
      // opening the build dialog on a simple tap. Capture is deferred to the first
      // real movement in onPointerMove, once a drag is actually underway.
    }

    function onPointerMove(e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (!captured && moved > 4) {
        captured = true;
        track.classList.add('is-dragging');
        track.style.willChange = 'transform';
        try { viewport.setPointerCapture(pointerId); } catch (err) { /* unsupported: drag still works */ }
      }
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) { velocity = (e.clientX - lastX) / dt; lastX = e.clientX; lastT = now; }
      setX(rubberband(startTranslate + dx, minX, maxX));
      if (Math.abs(dx) > 4 && e.cancelable) e.preventDefault();
    }

    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
      if (captured) { try { viewport.releasePointerCapture(pointerId); } catch (err) { /* no-op */ } }
      if (moved > 8) {
        const suppress = function (ev) { ev.stopPropagation(); ev.preventDefault(); };
        track.addEventListener('click', suppress, { capture: true, once: true });
      }
      settleWithMomentum();
    }

    let wheelIdleTimer = null;
    function onWheel(e) {
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!horizontal && !e.shiftKey) return;
      const delta = horizontal ? e.deltaX : e.deltaY;
      e.preventDefault();
      cancelMomentum();
      setX(clamp(x - delta, minX, maxX));
      clearTimeout(wheelIdleTimer);
      wheelIdleTimer = setTimeout(snapToNearest, 140);
    }

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);
    viewport.addEventListener('wheel', onWheel, { passive: false });

    if (prevBtn) prevBtn.addEventListener('click', function () { animateTo(Math.round(x / cardStep) * cardStep + cardStep); });
    if (nextBtn) nextBtn.addEventListener('click', function () { animateTo(Math.round(x / cardStep) * cardStep - cardStep); });

    viewport.setAttribute('tabindex', '0');
    viewport.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); animateTo(Math.round(x / cardStep) * cardStep - cardStep); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); animateTo(Math.round(x / cardStep) * cardStep + cardStep); }
    });

    window.addEventListener('resize', measure);
    measure();

    return { measure: measure };
  }

  window.VertexCarousel = { init: initDragCarousel };
})();
