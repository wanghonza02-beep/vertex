import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* Car detail pages need their gallery built from whatever actually sits in
   each car's public/cars/photos/<folder>/ directory — the brief asked for it
   "dynamically pulled," and photo counts genuinely vary (6 for most cars, 7
   for "7 - mercedes amg"). public/ is plain static passthrough in Vite (not
   part of the module graph), so import.meta.glob can't see into it — this
   plugin does the directory scan at request/build time instead and exposes
   the result as a virtual module, keeping photos/videos living under public/
   (see README.md's repeated "must live under public/" note) rather than
   moving originals into src/ just to make them glob-able. */
function carMediaPlugin() {
  const virtualId = 'virtual:car-media';
  const resolvedId = '\0' + virtualId;
  const photosRoot = path.join(__dirname, 'public/cars/photos');
  const videosRoot = path.join(__dirname, 'public/cars/videos');
  const IMAGE_RE = /\.(jpe?g|png|webp)$/i;
  const EXTRA_VIDEO_RE = /^(\d+)-(\d+)\.mp4$/i;
  const PHILOSOPHY_VIDEOS = new Set(['ig1.mp4', 'ig2.mp4', 'ig3.mp4', '1-1.mp4', '1-2.mp4', '1-3.mp4', '1-4.mp4']);

  function scan() {
    const photosByFolder = {};
    if (fs.existsSync(photosRoot)) {
      for (const dirent of fs.readdirSync(photosRoot, { withFileTypes: true })) {
        if (!dirent.isDirectory()) continue;
        const files = fs.readdirSync(path.join(photosRoot, dirent.name), { withFileTypes: true })
          .filter((f) => f.isFile() && IMAGE_RE.test(f.name))
          .map((f) => f.name)
          .sort();
        photosByFolder[dirent.name] = files;
      }
    }

    const extraVideosById = {};
    if (fs.existsSync(videosRoot)) {
      for (const dirent of fs.readdirSync(videosRoot, { withFileTypes: true })) {
        if (!dirent.isFile()) continue;
        // 1-1.mp4..1-4.mp4 (and ig1-3.mp4) already exist in this same flat
        // folder and match the id-M naming pattern below, but they're Our
        // Philosophy's process-step footage (assets/video/README.md), not
        // car id "1"'s gallery clips — excluded by name, not just pattern, so
        // a future add here can't silently reintroduce the same collision.
        if (PHILOSOPHY_VIDEOS.has(dirent.name)) continue;
        const m = dirent.name.match(EXTRA_VIDEO_RE);
        if (!m) continue;
        const id = m[1];
        (extraVideosById[id] || (extraVideosById[id] = [])).push(dirent.name);
      }
      Object.values(extraVideosById).forEach((list) => list.sort());
    }

    return { photosByFolder, extraVideosById };
  }

  function invalidate(server) {
    const mod = server.moduleGraph.getModuleById(resolvedId);
    if (mod) server.moduleGraph.invalidateModule(mod);
    server.ws.send({ type: 'full-reload' });
  }

  return {
    name: 'vertex-car-media',
    resolveId(id) { if (id === virtualId) return resolvedId; },
    load(id) { if (id === resolvedId) return `export default ${JSON.stringify(scan())};`; },
    configureServer(server) {
      server.watcher.add([photosRoot, videosRoot]);
      server.watcher.on('add', (p) => { if (p.startsWith(photosRoot) || p.startsWith(videosRoot)) invalidate(server); });
      server.watcher.on('unlink', (p) => { if (p.startsWith(photosRoot) || p.startsWith(videosRoot)) invalidate(server); });
    }
  };
}

export default defineConfig({
  plugins: [carMediaPlugin()],
  server: {
    port: 5173,
    strictPort: false
  }
});
