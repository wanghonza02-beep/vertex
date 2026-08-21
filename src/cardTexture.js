import * as THREE from 'three';
import { FLEET_DATA } from './fleetData.js';

/* Composites each fleet card's face onto a 2D canvas: an 80% video viewport
   on top, a 20% dark metadata bar (brand / model) on the bottom. One canvas +
   CanvasTexture per FLEET_DATA entry (12, not per pool mesh — src/scene.js's
   4x3=12 tile repeats these across up to 35 meshes), so the footage plays
   continuously from load, not just on hover.

   Redraws are gated on requestVideoFrameCallback where the browser supports
   it: with 12 clips decoding and compositing at once, redrawing+re-uploading
   a canvas on every render tick (~60fps) when the underlying video only has
   a new decoded frame every ~24-30fps is pure waste — rVFC's callback only
   fires when a frame actually changed, so cards visually update at exactly
   the same rate, just without the redundant work between frames. Browsers
   without rVFC (see hasNewFrame below) fall back to the simpler always-redraw
   behavior. No video file at a card's path (public/cars/videos/) yet? The
   <video> 404s, its 'error' listener flips videoFailed, and the video
   viewport falls back to the same blueprint-schematic register used
   elsewhere on the page — real brand/model text still renders either way,
   only the footage itself is a placeholder. */

const W = 480;
const H = 320;
const VIDEO_H = Math.round(H * 0.8);
const BAR_H = H - VIDEO_H;

function drawBlueprintFallback(ctx) {
  ctx.fillStyle = '#15171a';
  ctx.fillRect(0, 0, W, VIDEO_H);

  ctx.strokeStyle = 'rgba(46,59,71,0.35)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, VIDEO_H); ctx.stroke(); }
  for (let y = 0; y <= VIDEO_H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  ctx.strokeStyle = '#2E3B47';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, VIDEO_H - 2);

  ctx.strokeStyle = '#C9A66B';
  ctx.lineWidth = 2;
  const tick = 16, inset = 14;
  [[inset, inset, 1, 1], [W - inset, inset, -1, 1], [inset, VIDEO_H - inset, 1, -1], [W - inset, VIDEO_H - inset, -1, -1]]
    .forEach(([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x + tick * dx, y);
      ctx.moveTo(x, y); ctx.lineTo(x, y + tick * dy);
      ctx.stroke();
    });

  ctx.fillStyle = 'rgba(237,232,221,0.32)';
  ctx.font = '500 13px "IBM Plex Mono", ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('FOOTAGE PENDING', W / 2, VIDEO_H / 2);
}

function drawMetaBar(ctx, entry) {
  ctx.fillStyle = '#0B0C0E';
  ctx.fillRect(0, VIDEO_H, W, BAR_H);
  ctx.strokeStyle = '#2E3B47';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, VIDEO_H + 0.5);
  ctx.lineTo(W, VIDEO_H + 0.5);
  ctx.stroke();

  const midY = VIDEO_H + BAR_H / 2;
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#EDE8DD';
  ctx.font = '600 17px "IBM Plex Mono", ui-monospace, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(entry.brand, 16, midY);

  ctx.fillStyle = '#C9A66B';
  ctx.font = '500 14px "IBM Plex Mono", ui-monospace, monospace';
  ctx.textAlign = 'right';
  ctx.fillText(entry.model, W - 16, midY);
}

function buildOneSource(entry) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.preload = 'auto';
  if (entry.posterUrl) video.poster = entry.posterUrl;
  video.src = entry.videoUrl;
  // A <video> that's never inserted into the document can end up with decode
  // silently throttled or never started in some browsers — it must be a real
  // (if invisible) part of the page, not just an in-memory element handed to
  // drawImage(). display:none can itself pause decode in some engines too,
  // so this hides it by position instead of by display.
  video.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
  video.setAttribute('aria-hidden', 'true');
  document.body.appendChild(video);

  const source = {
    entry, canvas, ctx, video, texture: null,
    videoFailed: false, destroyed: false,
    hasNewFrame: true, usesFrameCallback: false
  };
  video.addEventListener('error', () => { source.videoFailed = true; });
  // A muted <video> is normally allowed to autoplay, but treat a rejected
  // play() (stricter embedded/policy contexts) the same as a load failure
  // rather than leaving the card stuck on a black frame.
  const playPromise = video.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(() => { source.videoFailed = true; });
  }

  if (typeof video.requestVideoFrameCallback === 'function') {
    source.usesFrameCallback = true;
    const onFrame = () => {
      source.hasNewFrame = true;
      if (!source.destroyed) video.requestVideoFrameCallback(onFrame);
    };
    video.requestVideoFrameCallback(onFrame);
  }

  drawBlueprintFallback(ctx);
  drawMetaBar(ctx, entry);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  source.texture = texture;
  return source;
}

export async function buildFleetCardSources() {
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch (err) { /* draw with fallback monospace */ }
  }
  return FLEET_DATA.map(buildOneSource);
}

export function updateFleetCardFrame(source) {
  const { ctx, video, entry, texture } = source;
  if (!source.videoFailed && video.readyState >= 2 /* HAVE_CURRENT_DATA */) {
    if (source.usesFrameCallback && !source.hasNewFrame) return; // nothing changed since the last draw — skip the redraw + GPU upload
    ctx.drawImage(video, 0, 0, W, VIDEO_H);
    source.hasNewFrame = false;
  } else {
    drawBlueprintFallback(ctx);
  }
  drawMetaBar(ctx, entry);
  texture.needsUpdate = true;
}

export function disposeFleetCardSource(source) {
  source.destroyed = true;
  source.video.pause();
  source.video.removeAttribute('src');
  source.video.load();
  source.video.remove();
  source.texture.dispose();
}
