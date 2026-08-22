/* The build-detail overlay (full spec breakdown + acoustic player) and a plain
   image lightbox (the touch fallback for the magnify lens). Both share one
   scrim/panel/focus-close shell, matching components/feedback/Dialog.jsx. */
(function () {
  let overlay = null, panel = null, lastFocus = null, waveInterval = null, closeTimer = null;

  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'vx-overlay';
    overlay.hidden = true;
    panel = document.createElement('div');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) close(); });
  }

  function open(html, extraClass) {
    ensureOverlay();
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    panel.className = 'vx-overlay-panel' + (extraClass ? ' ' + extraClass : '');
    panel.innerHTML = html;
    overlay.hidden = false;
    void overlay.offsetWidth;
    overlay.classList.add('is-open');
    lastFocus = document.activeElement;
    document.body.classList.add('vx-lock-scroll');
    // Every dismiss affordance carries data-close — the × button AND, inside the
    // build detail, the "Request this build" link (which also navigates to #contact,
    // so it must not have focus snapped back to the fleet card afterwards).
    panel.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        const isNavLink = el.tagName === 'A' && (el.getAttribute('href') || '').charAt(0) === '#';
        close(isNavLink);
      });
    });
    const closeBtn = panel.querySelector('.vx-close');
    if (closeBtn) closeBtn.focus();
    window.VertexIcons && window.VertexIcons.refresh(panel);
    window.VertexMagnify && window.VertexMagnify.init('.vx-overlay-panel [data-magnify]');
  }

  function close(skipFocusRestore) {
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove('is-open');
    document.body.classList.remove('vx-lock-scroll');
    clearInterval(waveInterval);
    closeTimer = setTimeout(function () { overlay.hidden = true; panel.innerHTML = ''; closeTimer = null; }, 240);
    if (!skipFocusRestore && lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function motifSrc(motif) { return 'assets/svg/motifs/' + motif + '.svg'; }

  function marqueOf(donorName) {
    if (donorName.indexOf('Mercedes-Benz') === 0) return 'Mercedes-Benz';
    return donorName.split(' ')[0];
  }

  function specNumberHTML(value, unit, label, tone, count) {
    return (
      '<div class="spec-num spec-num--' + (tone || 'paper') + '"' + (count ? ' data-count="' + value + '"' : '') + '>' +
        '<div class="spec-num-figure"><span class="spec-num-value">' + value + '</span>' +
        (unit ? '<span class="spec-num-unit">' + unit + '</span>' : '') + '</div>' +
        '<div class="spec-num-label">' + label + '</div>' +
      '</div>'
    );
  }

  function specRow(label, value, opts) {
    opts = opts || {};
    return (
      '<div class="spec-row' + (opts.accent ? ' is-accent' : '') + '">' +
        '<dt>' + label + '</dt><dd' + (opts.numeric ? ' class="is-numeric"' : '') + '>' + value + '</dd>' +
      '</div>'
    );
  }

  function statusTagHTML(b) {
    const tone = b.status === 'rare' ? 'rare' : b.status === 'sold' ? 'sold' : 'gold';
    const dot = (b.status === 'rare' || b.status === 'building') ? '<span class="tag-dot"></span>' : '';
    return '<span class="tag tag--' + tone + '">' + dot + b.statusLabel + '</span>';
  }

  function renderBuild(b) {
    return (
      '<button class="vx-close" data-close aria-label="Close"><i data-lucide="x"></i></button>' +
      '<div class="vx-detail">' +
        '<div class="vx-detail-media">' +
          '<div class="media-frame media-frame--tall" data-magnify data-magnify-label="' + b.code + '">' +
            '<img src="' + motifSrc('silhouette-' + b.motif) + '" alt="' + b.code + ' — ' + b.year + ' ' + b.donorName + '" loading="lazy">' +
          '</div>' +
          '<div class="vx-acoustic" data-acoustic>' +
            '<div class="vx-acoustic-tabs">' +
              '<button class="vx-acoustic-tab is-active" data-track="0">Cold start</button>' +
              '<button class="vx-acoustic-tab" data-track="1">Exhaust note</button>' +
            '</div>' +
            '<div class="vx-acoustic-body">' +
              '<button class="vx-acoustic-play" data-play aria-label="Play">' +
                '<span class="icon-toggle icon-toggle--play"><i data-lucide="play"></i></span>' +
                '<span class="icon-toggle icon-toggle--pause" hidden><i data-lucide="pause"></i></span>' +
              '</button>' +
              '<div class="vx-acoustic-bars" data-bars></div>' +
              '<span class="vx-acoustic-time" data-time>0:00</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="vx-detail-body">' +
          '<div class="eyebrow eyebrow--gold">' + b.code + ' — ' + b.year + ' ' + b.donorName + '</div>' +
          '<h2 class="vx-detail-title">' + b.title + '</h2>' +
          '<p class="vx-detail-donor">' + b.donor + '</p>' +
          statusTagHTML(b) +
          '<div class="spec-number-row spec-number-row--detail">' +
            specNumberHTML(b.power, 'hp', 'Power output', 'gold', true) +
            specNumberHTML(b.sprint, 'sec', '0–100 km/h', 'paper', false) +
            specNumberHTML(b.hours, 'hrs', 'Hand-finishing', 'paper', true) +
          '</div>' +
          '<dl class="spec-table">' +
            specRow('Paint', b.paint) +
            specRow('Interior', b.interior) +
            specRow('Wheels', b.wheels) +
            specRow('Torque', b.torque + ' Nm', { numeric: true }) +
            specRow('Top speed', b.topSpeed + ' km/h', { numeric: true }) +
            specRow('Weight', b.weight + ' kg', { numeric: true }) +
            specRow('Price', b.price, { accent: true }) +
          '</dl>' +
          '<a class="btn btn--primary" href="#contact" data-close data-prefill-marque="' + marqueOf(b.donorName) + '">Request this build</a>' +
        '</div>' +
      '</div>'
    );
  }

  function renderImage(src, label) {
    return (
      '<button class="vx-close" data-close aria-label="Close"><i data-lucide="x"></i></button>' +
      '<div class="vx-lightbox">' +
        '<img src="' + src + '" alt="' + (label || '') + '">' +
        (label ? '<span class="vx-lightbox-label">' + label + '</span>' : '') +
      '</div>'
    );
  }

  function wireAcoustic() {
    const root = panel.querySelector('[data-acoustic]');
    if (!root) return;
    const barsEl = root.querySelector('[data-bars]');
    const playBtn = root.querySelector('[data-play]');
    const timeEl = root.querySelector('[data-time]');
    const tabs = root.querySelectorAll('.vx-acoustic-tab');
    const tracks = [{ label: '0:04', secs: 4 }, { label: '0:11', secs: 11 }];
    let progress = 0, playing = false, activeTrack = 0;

    for (let i = 0; i < 56; i++) {
      const h = 16 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * 46;
      const span = document.createElement('span');
      span.style.height = h + '%';
      barsEl.appendChild(span);
    }

    function paint() {
      const children = barsEl.children;
      for (let i = 0; i < children.length; i++) {
        children[i].classList.toggle('is-lit', (i / children.length) * 100 <= progress);
      }
    }
    function updatePlayBtn() {
      playBtn.querySelector('.icon-toggle--play').hidden = playing;
      playBtn.querySelector('.icon-toggle--pause').hidden = !playing;
      playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    }
    function tick() {
      progress += (100 * 45) / (tracks[activeTrack].secs * 1000);
      if (progress >= 100) { progress = 0; playing = false; updatePlayBtn(); clearInterval(waveInterval); }
      paint();
    }

    playBtn.addEventListener('click', function () {
      playing = !playing;
      updatePlayBtn();
      clearInterval(waveInterval);
      if (playing) waveInterval = setInterval(tick, 45);
    });
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');
        activeTrack = parseInt(tab.getAttribute('data-track'), 10) || 0;
        timeEl.textContent = tracks[activeTrack].label;
        progress = 0; playing = false;
        clearInterval(waveInterval);
        updatePlayBtn();
        paint();
      });
    });

    timeEl.textContent = tracks[0].label;
    paint();
  }

  function openBuild(build) {
    open(renderBuild(build), 'vx-overlay-panel--detail');
    window.VertexReveal && window.VertexReveal.initCountUp(panel);
    wireAcoustic();
  }

  function openImage(detail) {
    open(renderImage(detail.src, detail.label), 'vx-overlay-panel--image');
  }

  window.addEventListener('vertex:magnify-open', function (e) { openImage(e.detail); });

  window.VertexDialog = { openBuild: openBuild, openImage: openImage, close: close };
})();
