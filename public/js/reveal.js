/* The brand's two signature motion moves, and only these two (see SKILL.md > Non-negotiables):
   blueprint rules draw themselves on scroll, and spec numbers count up from 0.
   Nothing else on the page animates in on scroll — no fades, no slide-ups. */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initDraw(root) {
    const rules = (root || document).querySelectorAll('[data-draw]');
    if (!rules.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      rules.forEach(function (r) { r.classList.add('is-drawn'); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-drawn'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    rules.forEach(function (r) { io.observe(r); });
  }

  function animateNumber(el) {
    const raw = el.getAttribute('data-count');
    const target = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
    const valueEl = el.querySelector('.spec-num-value');
    if (!valueEl || !isFinite(target)) return;
    if (reduced) { valueEl.textContent = raw; return; }
    const decimals = (String(raw).split('.')[1] || '').length;
    valueEl.textContent = (0).toFixed(decimals);
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

  function initCountUp(root) {
    const nums = (root || document).querySelectorAll('[data-count]');
    if (!nums.length) return;
    if (!('IntersectionObserver' in window)) { nums.forEach(animateNumber); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateNumber(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }

  window.VertexReveal = { initDraw: initDraw, initCountUp: initCountUp };
})();
