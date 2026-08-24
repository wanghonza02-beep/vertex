import * as THREE from 'three';
import { buildFleetCardSources, updateFleetCardFrame, disposeFleetCardSource } from './cardTexture.js';
import { FLEET_DATA } from './fleetData.js';

/* The infinite cylindrical card grid. Architecture notes:

   - Curvature is per-instance position/rotation math (trig around a virtual
     cylinder), not a vertex shader. Each card is its own mesh — that keeps every
     card independently raycastable for hover/click, which a single shader-warped
     continuous surface (or one texture-atlas cylinder) would make far harder to
     get right, at no real visual cost for a card count this size.

   - "Infinite" is a fixed pool of meshes (7x5 = 35) that all get their
     position/rotation and card content recomputed every frame from a continuous
     pan offset — not real infinite geometry, not a resize-triggered rebuild.
     Content tiles a 4x3 repeating pattern of the 12 FLEET_DATA cards via
     modulo indexing, so the grid can pan forever in any direction with no
     visible seam.

   - Each of those 12 cards is a <video> composited onto a canvas
     (src/cardTexture.js) — 12 canvases regardless of how many of the 35 pool
     meshes are currently showing that card, since meshes just reference one
     of the 12 shared CanvasTextures. Each canvas only redraws when its video
     actually has a new decoded frame ready (HTMLVideoElement.
     requestVideoFrameCallback, ~24-30fps of real work) rather than on every
     render tick (~60fps) — with 12 clips decoding and compositing at once,
     that's a real, visually-lossless save, not premature optimization.

   - Drag/momentum reuses the exact pointer-capture-deferred-until-real-movement
     pattern from js/carousel.js: capturing on every pointerdown (even a
     zero-movement click) was found via browser testing to break native click
     targeting in Chromium there, and the same risk applies here.

   - Concave, not convex: card position is the same (x = R·sinα, z recedes as
     |α| grows) as a plain outward-bulging dome would use, but the camera sits
     INSIDE that curve — near its center of curvature, at negative Z — instead
     of far outside it looking at the front face. Each card's rotation gets
     +Math.PI added to its horizontal (Y-axis) channel so its face turns to
     look back at the camera from inside the wall instead of away from it —
     that's the entire difference between "dome bulging at the viewer" and
     "standing inside a cylinder, wall wrapping around you," same trig, camera
     moved to the other side of the curve. */

const CARD_W = 2.4;
const CARD_H = 1.6;
const GAP = 0.4;
const CELL_W = CARD_W + GAP;
const CELL_H = CARD_H + GAP;
const RADIUS_X = 7.5; // was 9 — ~17% tighter for a more pronounced wraparound
const RADIUS_Y = 12.5; // was 15 — same ~17% reduction, curvature ratio unchanged
const CAMERA_INSET = 6.25; // was 7.5 — scaled down by the same ~17% as RADIUS_X so the camera/RADIUS_X ratio (and therefore the on-screen zoom/framing) stays exactly as it was; must stay < RADIUS_X or the camera overshoots its focal point
const CAMERA_FOV = 45;
const HALF_COLS = 3;
const HALF_ROWS = 2;
const TILE_COLS = 4;
const TILE_ROWS = 3; // TILE_COLS * TILE_ROWS must equal FLEET_DATA.length — asserted below
const DRAG_SENSITIVITY = 0.008;
const FRICTION = 0.94;
// The frame length every per-frame easing constant below (FRICTION, and the
// two 0.09/0.16 lerp factors in tick()/updateGrid()) was tuned against —
// see tick()'s own comment for why real elapsed time gets normalized
// against this rather than assumed.
const REF_FRAME_MS = 1000 / 60;

function mod(n, m) { return ((n % m) + m) % m; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

export async function initWebGLGrid(container, onCardActivate) {
  const canvas = container.querySelector('canvas');
  // Coarse pointer (touch) stands in for "mobile/tablet GPU" here rather
  // than a width check — a touch laptop or a narrow-but-precise trackpad
  // device would otherwise be mis-bucketed. MSAA and a full 2x pixel ratio
  // are the two most expensive things this renderer does, and the least
  // noticeable on a small, already-dense phone screen: AA smooths edges
  // pixels most phones are too small/dense to show jagged in the first
  // place, and a full 2x buffer is 4x the fill-rate of 1x for detail a
  // phone panel can't fully resolve anyway.
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !isCoarsePointer, alpha: true, powerPreference: 'high-performance' });
  } catch (err) {
    return null;
  }
  // Same cap as desktop (2x) regardless of pointer type — mobile no longer
  // needs its own degraded resolution tier now that phones default to (and
  // "3D Fleet" is locked to) List View, where this canvas only ever shows
  // as a heavily CSS-blurred ambient backdrop (see .webgl-list-view in
  // css/webgl-grid.css) rather than the sharp, fully interactive grid.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100);
  camera.position.set(0, 0, -CAMERA_INSET);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.AmbientLight(0xffffff, 1.7));

  console.assert(TILE_COLS * TILE_ROWS === FLEET_DATA.length, '[vertex] TILE_COLS x TILE_ROWS must equal FLEET_DATA.length or the tiling modulo math indexes out of bounds');
  const cardSources = await buildFleetCardSources();
  const textures = cardSources.map((s) => s.texture);
  const geometry = new THREE.PlaneGeometry(CARD_W, CARD_H);

  const pool = [];
  for (let r = -HALF_ROWS; r <= HALF_ROWS; r++) {
    for (let c = -HALF_COLS; c <= HALF_COLS; c++) {
      const material = new THREE.MeshBasicMaterial({ map: textures[0], transparent: true });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      pool.push({ mesh, cardIndex: -1, lift: 0, tiltX: 0, tiltY: 0, baseRotX: 0, baseRotY: 0 });
    }
  }

  let panX = 0, panY = 0;
  let velX = 0, velY = 0;
  let resetting = false;
  let dragging = false, captured = false, pointerId = null;
  let startClientX = 0, startClientY = 0, startPanX = 0, startPanY = 0;
  let lastClientX = 0, lastClientY = 0, lastT = 0;
  let moved = 0;
  let hoveredSlot = null;
  let hoverU = 0.5, hoverV = 0.5;
  let destroyed = false;
  // paused: set by src/main.js whenever Our Philosophy or a car detail page
  // covers this canvas completely (solid background, nothing of the grid is
  // ever visible). Without this the 12 showcase videos kept decoding, the
  // per-frame trig for all 35 pool meshes kept running, and the WebGLRenderer
  // kept issuing draw calls for a scene nobody could see — a large, pure-waste
  // GPU/CPU cost competing with whatever's actually on screen (Philosophy's
  // own up-to-7 videos, or a detail page's gallery). tick() simply stops
  // rescheduling itself while paused rather than doing hidden work every frame.
  let paused = false;
  // Independent from `paused` above (which src/main.js drives whenever
  // another view covers this canvas): the tab itself can also go into the
  // background (switch tabs, minimize, lock the phone) while still showing
  // the Fleet grid, which none of main.js's view-switching logic would ever
  // see. Same underlying waste as an uncovered-but-invisible canvas — a
  // render loop and 12 decoding videos nobody's looking at — so it gets
  // the same treatment, just from a second, independent trigger.
  let tabHidden = false;
  let rafId = null;
  // Real elapsed time since the last tick(), used to make the inertia/
  // reset-glide motion below frame-rate independent — null right after
  // (re)starting the loop so that first tick treats itself as exactly one
  // reference frame rather than computing a bogus dt against a stale
  // timestamp from before the gap. See tick() for how it's used.
  let lastTickTime = null;

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const meshList = pool.map(p => p.mesh);

  function screenToNdc(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pickHover(clientX, clientY) {
    screenToNdc(clientX, clientY);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(meshList);
    if (!hits.length) { hoveredSlot = null; return; }
    const hit = hits[0];
    hoveredSlot = pool.find(p => p.mesh === hit.object) || null;
    if (hit.uv) { hoverU = hit.uv.x; hoverV = hit.uv.y; }
  }

  function updateGrid(dtScale) {
    const liftFactor = 1 - Math.pow(1 - 0.16, dtScale); // see tick()'s comment on why this isn't just 0.16
    const centerCol = Math.round(panX / CELL_W);
    const centerRow = Math.round(panY / CELL_H);
    let idx = 0;
    for (let r = -HALF_ROWS; r <= HALF_ROWS; r++) {
      for (let c = -HALF_COLS; c <= HALF_COLS; c++) {
        const slot = pool[idx++];
        const cellCol = centerCol + c;
        const cellRow = centerRow + r;
        const cardIndex = mod(cellCol, TILE_COLS) + TILE_COLS * mod(cellRow, TILE_ROWS);
        if (slot.cardIndex !== cardIndex) {
          slot.mesh.material.map = textures[cardIndex];
          slot.mesh.material.needsUpdate = true;
          slot.cardIndex = cardIndex;
          if (slot !== hoveredSlot) { slot.lift = 0; slot.tiltX = 0; slot.tiltY = 0; }
        }

        const worldX = cellCol * CELL_W - panX;
        const worldY = cellRow * CELL_H - panY;
        const angleX = worldX / RADIUS_X;
        const angleY = worldY / RADIUS_Y;
        const x = RADIUS_X * Math.sin(angleX);
        const y = RADIUS_Y * Math.sin(angleY);
        const z = RADIUS_X * (Math.cos(angleX) - 1) + RADIUS_Y * (Math.cos(angleY) - 1);

        const isHovered = slot === hoveredSlot;
        const targetLift = isHovered ? 1 : 0;
        const targetTiltX = isHovered ? (hoverV - 0.5) * -0.35 : 0;
        const targetTiltY = isHovered ? (hoverU - 0.5) * 0.35 : 0;
        slot.lift = lerp(slot.lift, targetLift, liftFactor);
        slot.tiltX = lerp(slot.tiltX, targetTiltX, liftFactor);
        slot.tiltY = lerp(slot.tiltY, targetTiltY, liftFactor);

        slot.mesh.position.set(x, y, z + slot.lift * 0.45);
        // +Math.PI on the horizontal (Y-axis) rotation channel — not the
        // vertical one — flips each card to face the interior camera while
        // keeping text upright; putting the flip on the vertical channel
        // instead renders every card upside-down. Confirmed visually: swap
        // it and reload to see why.
        slot.mesh.rotation.set(-angleY + slot.tiltX, angleX + slot.tiltY + Math.PI, 0);
        const s = 1 + slot.lift * 0.08;
        slot.mesh.scale.setScalar(s);
      }
    }
  }

  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    // Touch has no hover phase — the first event IS the tap location, with
    // no preceding pointermove to have already run pickHover() the way a
    // mouse's cursor motion does before every click. Without this, a pure
    // tap-and-release on mobile always found hoveredSlot still null in
    // onPointerUp below, since `dragging` (set true right below, before any
    // pointermove) made every subsequent move event skip the hover check
    // entirely. Running it here first fixes touch and is a harmless no-op
    // for mouse, which usually already has this set from real hover anyway.
    pickHover(e.clientX, e.clientY);
    dragging = true;
    captured = false;
    pointerId = e.pointerId;
    moved = 0;
    startClientX = e.clientX; startClientY = e.clientY;
    startPanX = panX; startPanY = panY;
    lastClientX = e.clientX; lastClientY = e.clientY; lastT = performance.now();
    velX = 0; velY = 0;
  }

  function onPointerMove(e) {
    if (!dragging) { pickHover(e.clientX, e.clientY); return; }
    const dx = e.clientX - startClientX;
    const dy = e.clientY - startClientY;
    moved = Math.max(moved, Math.hypot(dx, dy));
    if (!captured && moved > 4) {
      captured = true;
      hoveredSlot = null;
      try { canvas.setPointerCapture(pointerId); } catch (err) { /* unsupported: drag still works */ }
    }
    const now = performance.now();
    const dt = now - lastT;
    if (dt > 0) {
      velX = (e.clientX - lastClientX) / dt;
      velY = (e.clientY - lastClientY) / dt;
      lastClientX = e.clientX; lastClientY = e.clientY; lastT = now;
    }
    panX = startPanX + dx * DRAG_SENSITIVITY;
    panY = startPanY + dy * DRAG_SENSITIVITY;
    if (e.cancelable) e.preventDefault();
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    if (captured) { try { canvas.releasePointerCapture(pointerId); } catch (err) { /* no-op */ } }
    if (moved <= 4 && onCardActivate && hoveredSlot) onCardActivate(hoveredSlot.cardIndex);
  }

  function onPointerLeaveCanvas() { if (!dragging) hoveredSlot = null; }

  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerLeaveCanvas);

  function resize() {
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  function stopLoop() {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
  }
  function startLoopIfActive() {
    if (!destroyed && !paused && !tabHidden && rafId == null) {
      lastTickTime = null; // see its own declaration — avoids a bogus dt across the gap this loop was stopped for
      rafId = requestAnimationFrame(tick);
    }
  }
  function handleVisibilityChange() {
    if (document.hidden) {
      tabHidden = true;
      stopLoop();
      cardSources.forEach((s) => { s.video.pause(); });
    } else {
      tabHidden = false;
      if (!paused) cardSources.forEach((s) => { s.video.play().catch(() => {}); });
      startLoopIfActive();
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange);

  function tick(now) {
    if (destroyed || paused || tabHidden) return; // no reschedule here — resume()/handleVisibilityChange above restart the chain
    // Every constant below (0.09, the literal 16, FRICTION) was originally
    // tuned assuming a steady 60fps (~16.67ms/frame) and applied per-frame
    // regardless of how much real time that frame actually spanned — fine
    // at exactly 60Hz, but a 120Hz phone display calls tick() roughly twice
    // as often per real second, so the same per-frame step covered half as
    // much real time each call: panning inertia and the reset-glide both
    // ran visibly faster (roughly 2x) than on a 60Hz display, and touch
    // orbit felt twitchy rather than fluid. dtScale below normalizes every
    // one of them against real elapsed time instead, so the feel this was
    // tuned for at 60fps now holds at any refresh rate. Capped at 100ms so
    // a stall (a dropped frame, a breakpoint, tab-switch jank) can't be
    // read as "a lot of real time passed" and produce one huge jump.
    const dt = lastTickTime != null ? Math.min(now - lastTickTime, 100) : REF_FRAME_MS;
    lastTickTime = now;
    const dtScale = dt / REF_FRAME_MS;

    if (!dragging && resetting) {
      // Eased glide back to the landing pan (0,0), not an instant snap.
      const resetFactor = 1 - Math.pow(1 - 0.09, dtScale);
      panX = lerp(panX, 0, resetFactor);
      panY = lerp(panY, 0, resetFactor);
      if (Math.abs(panX) < 0.01 && Math.abs(panY) < 0.01) {
        panX = 0; panY = 0; resetting = false;
      }
    } else if (!dragging) {
      // velX/velY are already a true per-millisecond velocity (set from
      // real pointermove timing in onPointerMove below) — multiplying by
      // the actual dt, not a fixed stand-in for "one frame," is what makes
      // this correct at any frame rate.
      panX += velX * dt * DRAG_SENSITIVITY;
      panY += velY * dt * DRAG_SENSITIVITY;
      const frictionFactor = Math.pow(FRICTION, dtScale);
      velX *= frictionFactor;
      velY *= frictionFactor;
      if (Math.abs(velX) < 0.0005) velX = 0;
      if (Math.abs(velY) < 0.0005) velY = 0;
    }
    cardSources.forEach(updateFleetCardFrame);
    updateGrid(dtScale);
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  return {
    resetView() {
      dragging = false;
      velX = 0; velY = 0;
      resetting = true;
    },
    // Stops the render loop AND the 12 underlying <video> sources (pausing
    // the canvas alone would leave them decoding, invisibly, behind whatever
    // now covers the canvas). Idempotent — safe to call from a navigation
    // handler that doesn't track whether the grid was already paused.
    pause() {
      if (paused) return;
      paused = true;
      stopLoop();
      cardSources.forEach((s) => { s.video.pause(); });
    },
    // Resumes both halves paused above and restarts tick()'s self-scheduling
    // chain — unless the tab itself is currently backgrounded, in which case
    // handleVisibilityChange's own "visible again" branch is what actually
    // restarts it, once that happens.
    resume() {
      if (!paused) return;
      paused = false;
      if (!tabHidden) cardSources.forEach((s) => { s.video.play().catch(() => {}); });
      startLoopIfActive();
    },
    destroy() {
      destroyed = true;
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeaveCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      geometry.dispose();
      cardSources.forEach(disposeFleetCardSource);
      pool.forEach(p => p.mesh.material.dispose());
      renderer.dispose();
    }
  };
}
