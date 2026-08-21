/* Sticky header: scroll-solidify state, mobile menu, active-section tracking. */
(function () {
  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > 40);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const toggle = header.querySelector('[data-menu-toggle]');
    const panel = document.querySelector('[data-mobile-menu]');
    if (toggle && panel) {
      const setOpen = function (open) {
        panel.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        const menuIcon = toggle.querySelector('.icon-toggle--menu');
        const closeIcon = toggle.querySelector('.icon-toggle--close');
        if (menuIcon) menuIcon.hidden = open;
        if (closeIcon) closeIcon.hidden = !open;
        document.body.classList.toggle('vx-lock-scroll', open);
      };
      toggle.addEventListener('click', function () { setOpen(!panel.classList.contains('is-open')); });
      panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    }

    const navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav-link]'));
    if (navLinks.length && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          const link = document.querySelector('[data-nav-link][href="#' + entry.target.id + '"]');
          if (link) link.classList.toggle('is-active', entry.isIntersecting);
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      navLinks.forEach(function (a) {
        const sec = document.querySelector(a.getAttribute('href'));
        if (sec) io.observe(sec);
      });
    }
  }

  window.VertexNav = { initHeader: initHeader };
})();
