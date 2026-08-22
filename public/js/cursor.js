/* Tactile custom cursor — desktop, fine-pointer only. Square geometry throughout
   (never a circle) so it stays inside the brand's 0px-radius rule; it becomes a
   small reticle over links and swells into a labelled pill over drag/inspect zones. */
(function () {
  const enabled = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!enabled) return;

  // Text fields keep their native I-beam — a decorative gold ring is no substitute
  // for the "you can type here" affordance, so the custom cursor steps aside for them.
  const FORM_SELECTOR = 'input, textarea, select, [contenteditable]';

  const dot = document.createElement('div');
  dot.className = 'vx-cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'vx-cursor-ring';
  ring.innerHTML = '<span class="vx-cursor-label"></span>';
  const label = ring.querySelector('.vx-cursor-label');

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let started = false;

  function setState(state, text) {
    ring.setAttribute('data-state', state || '');
    label.textContent = text || '';
  }

  function setNative(isNative) {
    ring.classList.toggle('is-native', isNative);
    dot.classList.toggle('is-native', isNative);
  }

  function onMove(e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    if (!started) {
      started = true;
      rx = mx; ry = my;
      document.body.appendChild(dot);
      document.body.appendChild(ring);
      document.documentElement.classList.add('has-custom-cursor');
      requestAnimationFrame(loop);
    }
  }

  function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
    requestAnimationFrame(loop);
  }

  window.addEventListener('pointermove', onMove);

  document.addEventListener('mouseover', function (e) {
    const formEl = e.target.closest ? e.target.closest(FORM_SELECTOR) : null;
    if (formEl) { setNative(true); return; }
    setNative(false);
    const target = e.target.closest ? e.target.closest('[data-cursor], a, button') : null;
    if (!target) return;
    const kind = target.getAttribute('data-cursor');
    if (kind === 'drag') setState('drag', 'DRAG');
    else if (kind === 'view') setState('view', 'VIEW');
    else setState('link', '');
  });
  document.addEventListener('mouseout', function (e) {
    const formEl = e.target.closest ? e.target.closest(FORM_SELECTOR) : null;
    if (formEl) {
      const toForm = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(FORM_SELECTOR);
      if (!toForm) setNative(false);
    }
    const target = e.target.closest ? e.target.closest('[data-cursor], a, button') : null;
    if (!target) return;
    const to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-cursor], a, button');
    if (to !== target) setState('', '');
  });
  document.addEventListener('mousedown', function () { ring.classList.add('is-pressed'); });
  document.addEventListener('mouseup', function () { ring.classList.remove('is-pressed'); });
  document.documentElement.addEventListener('mouseleave', function () { dot.style.opacity = 0; ring.style.opacity = 0; });
  document.documentElement.addEventListener('mouseenter', function () { dot.style.opacity = 1; ring.style.opacity = 1; });
})();
