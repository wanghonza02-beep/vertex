/* Precision-loupe magnify effect. A square reticle (never a circle — see cursor.js)
   follows the pointer over any [data-magnify] element and shows a zoomed crop of the
   same image via a background-image trick. On touch (no real hover), tapping the
   element dispatches vertex:magnify-open instead, which dialog.js turns into a
   full-size lightbox — a more native mobile pattern than a cursor-following lens. */
(function () {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ZOOM = 2.4;
  const LENS = 200;
  let lens = null;

  function ensureLens() {
    if (lens) return lens;
    lens = document.createElement('div');
    lens.className = 'magnify-lens';
    lens.style.width = LENS + 'px';
    lens.style.height = LENS + 'px';
    lens.innerHTML =
      '<span class="magnify-lens-cross"></span>' +
      '<span class="magnify-lens-corner magnify-lens-corner--tl"></span>' +
      '<span class="magnify-lens-corner magnify-lens-corner--tr"></span>' +
      '<span class="magnify-lens-corner magnify-lens-corner--bl"></span>' +
      '<span class="magnify-lens-corner magnify-lens-corner--br"></span>' +
      '<span class="magnify-lens-tag">' + ZOOM.toFixed(1) + '×</span>';
    document.body.appendChild(lens);
    return lens;
  }

  function sourceFor(el) {
    if (el.getAttribute('data-magnify-src')) return el.getAttribute('data-magnify-src');
    const img = el.querySelector('img');
    return img ? img.getAttribute('src') : null;
  }

  function bind(el, standalone) {
    if (el.__vxMagnifyBound) return;
    el.__vxMagnifyBound = true;
    const src = sourceFor(el);
    if (!src) return;
    el.setAttribute('data-cursor', 'view');

    function openLightbox() {
      window.dispatchEvent(new CustomEvent('vertex:magnify-open', {
        detail: { src: src, label: el.getAttribute('data-magnify-label') || '' }
      }));
    }

    // Standalone elements (gallery shots, the dialog's own hero image) open a full
    // lightbox on click/Enter — they have no other purpose. Fleet-card media does not:
    // a click there must fall through to the card's own "open build" handler instead,
    // so the whole card stays a single, unambiguous click target.
    if (standalone) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
      el.addEventListener('click', openLightbox);
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(); }
      });
    }

    // No real hover on touch: the click/Enter binding above (when standalone) is the
    // only interaction possible, so there is nothing further to wire up here.
    if (!canHover) return;

    let rect = null;

    el.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') return;
      rect = el.getBoundingClientRect();
      const l = ensureLens();
      l.style.backgroundImage = 'url(' + src + ')';
      l.style.backgroundSize = (rect.width * ZOOM) + 'px ' + (rect.height * ZOOM) + 'px';
      l.classList.add('is-active');
      el.classList.add('is-magnifying');
    });
    el.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || !lens || !rect) return;
      const fx = (e.clientX - rect.left) / rect.width;
      const fy = (e.clientY - rect.top) / rect.height;
      lens.style.left = e.clientX + 'px';
      lens.style.top = e.clientY + 'px';
      lens.style.backgroundPosition =
        (-(fx * rect.width * ZOOM - LENS / 2)) + 'px ' + (-(fy * rect.height * ZOOM - LENS / 2)) + 'px';
    });
    el.addEventListener('pointerleave', function () {
      if (lens) lens.classList.remove('is-active');
      el.classList.remove('is-magnifying');
    });
  }

  function init(selector, options) {
    const standalone = !options || options.standalone !== false;
    document.querySelectorAll(selector || '[data-magnify]').forEach(function (el) { bind(el, standalone); });
  }

  window.VertexMagnify = { init: init };
})();
