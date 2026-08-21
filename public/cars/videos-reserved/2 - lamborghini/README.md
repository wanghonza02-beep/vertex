# Reserved — not wired into the site yet

`2-1.mp4` (15s) and `2-2.mp4` (10s), both already H.264/1920×1080 (no transcode
needed if used later, unlike the codec note in `assets/video/README.md`). Moved
here from the project root, where they'd previously landed as loose files
outside `public/` — same "silently dropped by `vite build`" trap documented
everywhere else in this repo.

These belong to car id `2` (Lamborghini — `PROJECT CHERRY BLOSSOM`,
`src/fleetData.js`), matching the numbering of that car's own showcase clip
(`public/cars/videos/2.mp4`). Deliberately kept out of `public/cars/videos/`
(the folder the detail page's dynamic gallery scans) and out of
`public/cars/photos/2 - lamborghini/` (photos only) so no future glob/scan
picks them up by accident — per explicit instruction, on hold for future use,
not yet shown anywhere on the site. To bring one into the car-2 detail
gallery: move it into `public/cars/videos/` as `2-3.mp4` (or similar) and it
will be picked up automatically (see `vite.config.js`'s car-media plugin) —
no other code changes needed.
