/* Orchestration for the full 2D site (#siteFallback) — hero, philosophy, fleet
   carousel, craft, gallery, contact form, footer. This entire module's work is
   now gated behind activateFallback(): the fullscreen WebGL grid (src/main.js)
   is the default landing experience, and none of this DOM rendering or these
   listeners are worth paying for while that's what's showing. activateFallback()
   runs either immediately (window.__vertexWebGL is false — see the inline
   detector in index.html's <head>) or later, called by src/main.js if a WebGL
   context inits but then fails at runtime. */
(function () {
  function statusToneClass(status) {
    return status === 'rare' ? 'rare' : status === 'sold' ? 'sold' : status === 'building' ? 'neutral' : 'gold';
  }

  function buildCardHTML(b) {
    const dot = (b.status === 'rare' || b.status === 'building') ? '<span class="tag-dot"></span>' : '';
    return (
      '<article class="build-card" data-id="' + b.id + '" tabindex="0" role="button" aria-label="View ' + b.code + ' — ' + b.title + '">' +
        '<div class="media-frame build-card-media" data-magnify data-magnify-label="' + b.code + ' — ' + b.title + '">' +
          '<img src="assets/svg/motifs/silhouette-' + b.motif + '.svg" alt="' + b.year + ' ' + b.donorName + ', ' + b.title + '" loading="lazy">' +
          '<video muted loop playsinline preload="none" data-src="assets/video/fleet/' + b.id + '.mp4" aria-hidden="true"></video>' +
        '</div>' +
        '<div class="build-card-body">' +
          '<div class="build-card-top">' +
            '<span class="eyebrow eyebrow--brass">' + b.code + '</span>' +
            '<span class="tag tag--' + statusToneClass(b.status) + '">' + dot + b.statusLabel + '</span>' +
          '</div>' +
          '<h3 class="build-card-title">' + b.title + '</h3>' +
          '<p class="build-card-donor">' + b.year + ' ' + b.donorName + '</p>' +
          '<div class="build-card-metrics">' +
            '<div><span class="metric-value">' + b.power + '</span><span class="metric-label">Power (hp)</span></div>' +
            '<div><span class="metric-value">' + b.hours + '</span><span class="metric-label">Hours</span></div>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function galleryItemHTML(g) {
    return (
      '<figure class="gallery-item" data-magnify data-magnify-label="' + g.label + ' — ' + g.caption + '">' +
        '<img src="assets/svg/motifs/detail-' + g.motif + '.svg" alt="' + g.label + ', ' + g.caption + '" loading="lazy">' +
        '<figcaption><span class="eyebrow eyebrow--brass">' + g.label + '</span>' + g.caption + '</figcaption>' +
      '</figure>'
    );
  }

  function processStepHTML(s) {
    return (
      '<div class="process-step">' +
        '<div class="bp-rule" data-draw></div>' +
        '<div class="process-step-index">' + s.n + '</div>' +
        '<div class="process-step-body">' +
          '<span class="eyebrow eyebrow--gold">' + s.tech + '</span>' +
          '<h3>' + s.title + '</h3>' +
          '<p>' + s.body + '</p>' +
        '</div>' +
      '</div>'
    );
  }

  function initBeforeAfter() {
    const el = document.querySelector('[data-before-after]');
    if (!el) return;
    const clip = el.querySelector('.before-after-clip');
    const handle = el.querySelector('.before-after-handle');
    let dragging = false;
    function move(clientX) {
      const r = el.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
      clip.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
    }
    el.addEventListener('pointerdown', function (e) {
      dragging = true;
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* no-op */ }
      move(e.clientX);
    });
    el.addEventListener('pointermove', function (e) { if (dragging) move(e.clientX); });
    el.addEventListener('pointerup', function () { dragging = false; });
    el.addEventListener('pointercancel', function () { dragging = false; });
    el.addEventListener('keydown', function (e) {
      const r = el.getBoundingClientRect();
      const current = parseFloat(handle.style.left) || 50;
      if (e.key === 'ArrowLeft') { e.preventDefault(); move(r.left + (r.width * Math.max(0, current - 5) / 100)); }
      if (e.key === 'ArrowRight') { e.preventDefault(); move(r.left + (r.width * Math.min(100, current + 5) / 100)); }
    });
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'slider');
    el.setAttribute('aria-label', 'Compare donor chassis to finished build');
  }

  function footerColumnHTML(col) {
    return (
      '<div class="footer-col">' +
        '<div class="footer-col-title">' + col.title + '</div>' +
        '<div class="footer-col-links">' + col.links.map(function (l) { return '<a href="#">' + l + '</a>'; }).join('') + '</div>' +
      '</div>'
    );
  }

  function findBuild(id) {
    for (let i = 0; i < VERTEX_BUILDS.length; i++) if (VERTEX_BUILDS[i].id === id) return VERTEX_BUILDS[i];
    return null;
  }

  function openBuildFromEl(el) {
    const card = el.closest && el.closest('.build-card');
    if (!card) return;
    const build = findBuild(card.getAttribute('data-id'));
    if (build && window.VertexDialog) window.VertexDialog.openBuild(build);
  }

  let fallbackActivated = false;
  function activateFallback() {
    if (fallbackActivated) return;
    fallbackActivated = true;

    const siteFallback = document.getElementById('siteFallback');
    if (siteFallback) siteFallback.hidden = false;

    const track = document.getElementById('fleetTrack');
    if (track) {
      track.innerHTML = VERTEX_BUILDS.map(buildCardHTML).join('');
      track.addEventListener('click', function (e) { openBuildFromEl(e.target); });
      track.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          const card = e.target.closest && e.target.closest('.build-card');
          if (card) { e.preventDefault(); openBuildFromEl(e.target); }
        }
      });
    }

    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) galleryGrid.innerHTML = VERTEX_GALLERY.map(galleryItemHTML).join('');

    const processList = document.getElementById('processList');
    if (processList) processList.innerHTML = VERTEX_PROCESS.map(processStepHTML).join('');

    const footerCols = document.getElementById('footerColumns');
    if (footerCols) footerCols.innerHTML = VERTEX_FOOTER.map(footerColumnHTML).join('');

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Clicking "Request this build" inside the detail dialog carries the donor's
    // marque through to the contact form's donor-interest field.
    document.addEventListener('click', function (e) {
      const el = e.target.closest && e.target.closest('[data-prefill-marque]');
      if (!el) return;
      const sel = document.getElementById('donorInterest');
      if (sel) sel.value = el.getAttribute('data-prefill-marque');
    });

    window.VertexIcons && window.VertexIcons.refresh();
    window.VertexNav && window.VertexNav.initHeader();
    window.VertexReveal && window.VertexReveal.initDraw();
    window.VertexReveal && window.VertexReveal.initCountUp();
    window.VertexMedia && window.VertexMedia.initHeroVideo();
    window.VertexMedia && window.VertexMedia.initFleetVideos();
    window.VertexForm && window.VertexForm.initInquiryForm();

    if (window.VertexMagnify) {
      window.VertexMagnify.init('.build-card-media', { standalone: false });
      window.VertexMagnify.init('.gallery-item');
    }

    initBeforeAfter();

    const fleetViewport = document.getElementById('fleetViewport');
    if (fleetViewport && track && window.VertexCarousel) {
      window.VertexCarousel.init({
        viewport: fleetViewport,
        track: track,
        progressFill: document.getElementById('fleetProgressFill'),
        prevBtn: document.getElementById('fleetPrev'),
        nextBtn: document.getElementById('fleetNext')
      });
    }
  }
  window.VertexActivateFallback = activateFallback;

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.__vertexWebGL) activateFallback();
    // If WebGL IS supported, do nothing here — src/main.js either mounts the
    // grid successfully (this module's work never runs at all) or calls
    // window.VertexActivateFallback() itself from its catch handler.
  });
})();
