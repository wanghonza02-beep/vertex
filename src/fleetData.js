/* Central fleet data for the WebGL showcase cards (video + metadata bar) AND
   the car detail page (src/detailView.js). This is its own 12-car lineup,
   independent of the 10 real builds in js/data.js (VERTEX_BUILDS) — the
   showcase grid deliberately uses invented project codenames rather than the
   actual commissioned-build roster. Real showcase footage lives in
   public/cars/videos/{1..12}.mp4 (served at /cars/videos/…; public/ is
   required so it also survives a production build, not just `npm run dev`).

   photoFolder is the exact directory name under public/cars/photos/ — spaces
   and inconsistent casing ("10 - Ford" vs "9 - nissan") preserved verbatim
   because that's what actually exists on disk. The detail page's gallery
   doesn't hardcode filenames or counts: vite.config.js's car-media plugin
   scans each folder at request time and the count varies per car (6 for most,
   7 for "7 - mercedes amg") — see src/detailView.js.

   power/sprint/topSpeed/weight are Vertex's own post-build figures, not the
   donor's factory spec — deliberately offset from any real production car's
   published numbers (several of these donors are still-in-production modern
   flagships) so nothing here reads as a factual claim about that car as sold
   by its actual manufacturer. */

export const FLEET_DATA = [
  {
    id: '1', brand: 'PORSCHE', model: 'PROJECT NIGHTHAWK', donor: '911',
    videoUrl: '/cars/videos/1.mp4', posterUrl: '/cars/photos/1 - porsche/01.jpg',
    photoFolder: '1 - porsche',
    engine: '3.8L Twin-Turbo Flat-Six', power: '590', sprint: '3.1', topSpeed: '315', weight: '1,340',
    backstory: [
      'The donor arrived as a numbers-matching 911 coupe, dark under a decade of storage. Every panel came off, every weld was inspected, and the shell went back to bare metal before a single new part was fitted — nothing about the silhouette was ever open for discussion.',
      "What changed sits beneath it: a twin-turbocharged flat-six built for this chassis alone, a fully re-engineered suspension geometry, and a cabin finished by hand over eleven months. The result drives nothing like the car it once was, and looks exactly like it."
    ]
  },
  {
    id: '2', brand: 'LAMBORGHINI', model: 'PROJECT CHERRY BLOSSOM', donor: 'AVENTADOR',
    videoUrl: '/cars/videos/2.mp4', posterUrl: '/cars/photos/2 - lamborghini/01.jpg',
    photoFolder: '2 - lamborghini',
    engine: '6.5L Naturally Aspirated V12', power: '780', sprint: '2.6', topSpeed: '355', weight: '1,525',
    backstory: [
      'Even a Lamborghini this rare is still one of several hundred nearly identical chassis leaving the same factory line. Project Cherry Blossom began with that problem — a client who wanted the V12 and the drama, but not the sameness.',
      'The atelier stripped the factory livery entirely and hand-finished a deep cherry-lacquer paint system unique to this commission, paired with a bespoke illuminated wheel signature designed and wired in-house. No other Aventador on the road carries either.'
    ]
  },
  {
    id: '3', brand: 'FERRARI', model: 'PROJECT PEACH', donor: 'MONZA SP2',
    videoUrl: '/cars/videos/3.mp4', posterUrl: '/cars/photos/3 - ferarri/01.jpg',
    photoFolder: '3 - ferarri',
    engine: '6.5L Naturally Aspirated V12', power: '830', sprint: '2.8', topSpeed: '335', weight: '1,490',
    backstory: [
      'A barchetta with no roof and no windscreen frame is already a rare thing — Ferrari built this speedster in limited numbers for exactly that reason. Project Peach takes the rarity further with a champagne-gold livery mixed and sprayed specifically for this car.',
      "The V12 and chassis are untouched — some engineering doesn't need Vertex's involvement. Everything visible does: the paint, the cabin stitching, and the badging were all reworked over four months in the studio."
    ]
  },
  {
    id: '4', brand: 'LOTUS', model: 'PROJECT SHADOW', donor: 'EVIJA',
    videoUrl: '/cars/videos/4.mp4', posterUrl: '/cars/photos/4 - lotus/01.jpg',
    photoFolder: '4 - lotus',
    engine: 'Quad-Motor Electric Powertrain', power: '2,010', sprint: '2.7', topSpeed: '320', weight: '1,720',
    backstory: [
      "An electric hypercar this powerful doesn't need a louder engine note — it needs somewhere to hide. Project Shadow strips every reflective surface from the factory body and replaces it with a matte-black ceramic coating developed for this commission alone.",
      'The quad-motor powertrain stays factory-spec; the light signature does not. A cold-blue running light system was designed in-house and integrated into the wheel wells and front splitter, visible only once the car is moving.'
    ]
  },
  {
    id: '5', brand: 'ASTON MARTIN', model: 'PROJECT VANGUARD', donor: 'VALKYRIE',
    videoUrl: '/cars/videos/5.mp4', posterUrl: '/cars/photos/5 - aston martin/01.jpg',
    photoFolder: '5 - aston martin',
    engine: '6.5L N/A V12 + Hybrid', power: '1,155', sprint: '2.5', topSpeed: '350', weight: '1,080',
    backstory: [
      "Few road cars borrow this directly from a Formula 1 program. Project Vanguard's brief was simple: change nothing about what makes the Valkyrie an engineering outlier, and change everything about how it's finished.",
      'British racing green was hand-mixed to a shade unique to this build, exposed carbon weave was left raw rather than lacquered, and the cabin was re-trimmed in a single continuous hide sourced specifically for this commission.'
    ]
  },
  {
    id: '6', brand: 'MCLAREN', model: 'PROJECT APEX', donor: 'SENNA',
    videoUrl: '/cars/videos/6.mp4', posterUrl: '/cars/photos/6 - mclaren/01.jpg',
    photoFolder: '6 - mclaren',
    engine: '4.0L Twin-Turbo V8', power: '825', sprint: '2.7', topSpeed: '340', weight: '1,260',
    backstory: [
      'The Senna was built by McLaren with almost nothing left un-vented — every surface exists to move air, not to look finished. Project Apex leaned into that rather than softening it.',
      'A raw exposed-carbon monocoque was paired with a hand-laid gold pinstripe system, picked out panel by panel to catch the aero surfaces rather than hide them. The powertrain and aero package are factory; the finish is one of one.'
    ]
  },
  {
    id: '7', brand: 'MERCEDES-AMG', model: 'PROJECT STEALTH', donor: 'GT BLACK SERIES',
    videoUrl: '/cars/videos/7.mp4', posterUrl: '/cars/photos/7 - mercedes amg/01.jpg',
    photoFolder: '7 - mercedes amg',
    engine: '4.0L Twin-Turbo V8', power: '815', sprint: '3.0', topSpeed: '325', weight: '1,540',
    backstory: [
      "AMG's own Black Series is already the sharpest version of the GT that exists. Project Stealth's commission was to make it disappear — a deep matte-black ceramic finish over every panel, badge included.",
      "Vertex's own engine calibration sits underneath, tightening throttle response and recalibrating the active aero for a client who wanted the track weapon without the track-day paint scheme every other Black Series wears."
    ]
  },
  {
    id: '8', brand: 'AUDI', model: 'PROJECT CYBERLINE', donor: 'RS E-TRON GT',
    videoUrl: '/cars/videos/8.mp4', posterUrl: '/cars/photos/8 - audi/01.jpg',
    photoFolder: '8 - audi',
    engine: 'Dual-Motor Electric Powertrain', power: '780', sprint: '2.9', topSpeed: '270', weight: '2,150',
    backstory: [
      'An electric GT this quiet needed a visual signature to match its silence. Project Cyberline is built around a single running light — a continuous LED line traced from the front splitter, over the roof, and into the taillight.',
      'The dual-motor powertrain is unchanged; the cabin and lighting were not. Every interior surface was re-trimmed in a single commission-specific material palette designed to read as digital as the drivetrain underneath it.'
    ]
  },
  {
    id: '9', brand: 'NISSAN', model: 'PROJECT DRIFT KING', donor: 'GT-R NISMO',
    videoUrl: '/cars/videos/9.mp4', posterUrl: '/cars/photos/9 - nissan/01.jpg',
    photoFolder: '9 - nissan',
    engine: '3.8L Twin-Turbo V6', power: '720', sprint: '2.7', topSpeed: '320', weight: '1,720',
    backstory: [
      "The GT-R Nismo has spent two decades earning its reputation on track and in every drift circuit it's ever seen. Project Drift King's brief came from a client who wanted that reputation intact, just sharper.",
      "Vertex's own calibration work lifted output well past the factory figure, paired with a gunmetal livery and a quad-lamp signature left otherwise untouched — this is a car that didn't need reinventing, only refining."
    ]
  },
  {
    id: '10', brand: 'FORD', model: 'PROJECT MACH 1', donor: 'MUSTANG',
    videoUrl: '/cars/videos/10.mp4', posterUrl: '/cars/photos/10 - Ford/01.jpg',
    photoFolder: '10 - Ford',
    engine: '5.0L Supercharged V8', power: '750', sprint: '3.4', topSpeed: '290', weight: '1,590',
    backstory: [
      'A 1969 fastback shell, stripped to bare metal and rebuilt with a modern supercharged small-block underneath. Project Mach 1 keeps the exact factory stance and a black-over-gunmetal livery period-correct to the year.',
      "Everything under the skin is new: a forged bottom end, a fully rebuilt suspension geometry, and a cabin quietly updated with modern switchgear hidden behind original-spec dials. Nothing about the silhouette was negotiable — the same rule as every build before it."
    ]
  },
  {
    id: '11', brand: 'BUGATTI', model: 'PROJECT PHANTOM', donor: 'CHIRON',
    videoUrl: '/cars/videos/11.mp4', posterUrl: '/cars/photos/11 - bugatti/01.jpg',
    photoFolder: '11 - bugatti',
    engine: '8.0L Quad-Turbo W16', power: '1,600', sprint: '2.3', topSpeed: '420', weight: '1,995',
    backstory: [
      "The quad-turbo W16 stays exactly as Molsheim built it — some engineering is beyond even Vertex's improvement. Project Phantom's commission was entirely about what surrounds it.",
      'A deep carbon-and-blue livery was hand-finished panel by panel, and the cabin was re-trimmed in a single hide sourced specifically for this client. What leaves the studio drives identically to the day it arrived, and looks like nothing else on the road.'
    ]
  },
  {
    id: '12', brand: 'KOENIGSEGG', model: 'PROJECT GHOST', donor: 'JESKO',
    videoUrl: '/cars/videos/12.mp4', posterUrl: '/cars/photos/12 - koenigsegg/01.jpg',
    photoFolder: '12 - koenigsegg',
    engine: '5.0L Twin-Turbo V8', power: '1,650', sprint: '2.5', topSpeed: '480', weight: '1,320',
    backstory: [
      'Every visible panel on this Jesko is raw exposed carbon weave, left unpainted by design — the commission asked for the engineering to speak for itself, with nothing hiding it.',
      "Vertex's contribution is restraint: a studio-grade clear-coat system that protects the weave without dulling it, and a cabin re-trimmed to match. Project Ghost is the quietest build in the fleet, and the fastest."
    ]
  }
];
