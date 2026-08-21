/* Video handling for the hero loop and fleet-card hover previews.
   No footage ships with this build (see /assets/video/README.md) — every <video> here
   fails gracefully: on error it stays hidden and the SVG blueprint motif underneath
   keeps showing. Drop a real MP4 at the documented path and it takes over automatically,
   with no code changes. Fleet videos are lazy: nothing loads until the card is hovered,
   and only one plays at a time, so CPU stays flat regardless of fleet size. */
(function () {
  function initHeroVideo() {
    const wrap = document.querySelector('[data-hero-video]');
    if (!wrap) return;
    const video = wrap.querySelector('video');
    const src = video && video.getAttribute('data-src');
    if (!video || !src) return;
    video.addEventListener('error', function () { wrap.classList.add('video-unavailable'); }, { once: true });
    video.addEventListener('loadeddata', function () { wrap.classList.add('video-ready'); }, { once: true });
    video.src = src;
    video.load();
    const p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  function initFleetVideos(root) {
    (root || document).querySelectorAll('.build-card').forEach(function (card) {
      const video = card.querySelector('video');
      const src = video && video.getAttribute('data-src');
      if (!video || !src) return;
      let attempted = false, failed = false;

      card.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse' || failed) return;
        if (!attempted) {
          attempted = true;
          video.addEventListener('error', function () { failed = true; card.classList.remove('video-ready'); }, { once: true });
          video.addEventListener('playing', function () { card.classList.add('video-ready'); }, { once: true });
          video.src = src;
          video.load();
        }
        const p = video.play();
        if (p && p.catch) p.catch(function () {});
      });
      card.addEventListener('pointerleave', function () {
        if (!video.paused) video.pause();
        card.classList.remove('video-ready');
      });
    });
  }

  window.VertexMedia = { initHeroVideo: initHeroVideo, initFleetVideos: initFleetVideos };
})();
