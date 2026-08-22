/* Vertex — content data. Plain globals (no bundler): loaded before main.js via <script defer>. */

const VERTEX_BUILDS = [
  { id:'p01', code:'Project 01', year:1989, donorName:'Porsche 911 Targa (964)', title:'Monaco Edition',
    donor:'Air-cooled 3.6 flat-six, matching numbers', status:'rare', statusLabel:'1 of 1 — rare donor',
    power:'640', sprint:'3.2', hours:'1,247', torque:'580', topSpeed:'312', weight:'1,290',
    paint:'PTS Monaco Blue', interior:'Cognac full-grain leather, hand-stitched', wheels:'18″ forged three-piece',
    price:'On application', motif:'coupe' },
  { id:'p02', code:'Project 02', year:1971, donorName:'Mercedes-Benz 280 SL', title:'Riviera',
    donor:'Pagoda hardtop, single-owner shell', status:'available', statusLabel:'Available',
    power:'420', sprint:'4.1', hours:'1,104', torque:'490', topSpeed:'270', weight:'1,340',
    paint:'Anthracite over Cognac', interior:'Cognac leather, burr walnut', wheels:'17″ polished alloy',
    price:'On application', motif:'roadster' },
  { id:'p03', code:'Project 03', year:1984, donorName:'Lamborghini Jalpa', title:'Sant’Agata',
    donor:'Targa, factory 3.5 V8 rebuilt to 4.0', status:'building', statusLabel:'In build',
    power:'505', sprint:'3.8', hours:'860', torque:'460', topSpeed:'302', weight:'1,410',
    paint:'Nero Opaco', interior:'Black Alcantara, exposed carbon', wheels:'18″ split-five, satin black',
    price:'Reserved', motif:'wedge' },
  { id:'p04', code:'Project 04', year:1993, donorName:'Porsche 964 Turbo', title:'Nordschleife',
    donor:'3.6 Turbo, factory Speed Yellow', status:'sold', statusLabel:'Sold 2024',
    power:'700', sprint:'2.9', hours:'1,392', torque:'640', topSpeed:'328', weight:'1,270',
    paint:'Speed Yellow, satin', interior:'Black full-grain leather, yellow stitching', wheels:'18″ forged center-lock',
    price:'Sold 2024', motif:'coupe' },
  { id:'p05', code:'Project 05', year:1987, donorName:'Ferrari 328 GTS', title:'Fiorano',
    donor:'Factory 3.2 V8, gated manual', status:'rare', statusLabel:'1 of 1 — Ferrari donor',
    power:'480', sprint:'3.6', hours:'980', torque:'430', topSpeed:'296', weight:'1,250',
    paint:'Rosso Corsa, satin', interior:'Nero leather, exposed carbon dash', wheels:'17″ forged five-spoke',
    price:'On application', motif:'wedge' },
  { id:'p06', code:'Project 06', year:1965, donorName:'Porsche 911', title:'Ur-Elfer',
    donor:'Short-wheelbase, numbers matching', status:'sold', statusLabel:'Sold 2023',
    power:'450', sprint:'3.9', hours:'1,510', torque:'400', topSpeed:'280', weight:'1,180',
    paint:'Slate Grey', interior:'Chestnut leather, houndstooth inserts', wheels:'16″ Fuchs-style forged',
    price:'Sold 2023', motif:'coupe' },
  { id:'p07', code:'Project 07', year:1976, donorName:'Mercedes-Benz 450 SL', title:'Côte d’Azur',
    donor:'R107, matching-numbers shell', status:'available', statusLabel:'Available',
    power:'380', sprint:'4.4', hours:'990', torque:'470', topSpeed:'260', weight:'1,390',
    paint:'Ivory over Saddle Tan', interior:'Saddle Tan full-grain leather', wheels:'16″ polished alloy',
    price:'On application', motif:'roadster' },
  { id:'p08', code:'Project 08', year:1990, donorName:'Lamborghini Countach 25° Anniversario', title:'Imola',
    donor:'5.2 V12, factory wide-body', status:'building', statusLabel:'In build',
    power:'560', sprint:'3.5', hours:'1,680', torque:'510', topSpeed:'310', weight:'1,490',
    paint:'Giallo Taxi, satin', interior:'Black leather and Alcantara', wheels:'17″ OZ-style split-five',
    price:'Reserved', motif:'wedge' },
  { id:'p09', code:'Project 09', year:1972, donorName:'Porsche 911 S', title:'Sexpress',
    donor:'2.4 S, sunroof coupe', status:'available', statusLabel:'Available',
    power:'410', sprint:'4.0', hours:'1,050', torque:'390', topSpeed:'270', weight:'1,150',
    paint:'Signal Orange', interior:'Black leather, orange accent stitching', wheels:'16″ Fuchs-style forged',
    price:'On application', motif:'coupe' },
  { id:'p10', code:'Project 10', year:1969, donorName:'Mercedes-Benz 280 SE Cabriolet', title:'Alpine',
    donor:'W111, factory sunroof delete', status:'sold', statusLabel:'Sold 2022',
    power:'400', sprint:'4.6', hours:'1,190', torque:'460', topSpeed:'255', weight:'1,420',
    paint:'Dark Olive', interior:'Cognac leather, burr walnut', wheels:'15″ polished alloy',
    price:'Sold 2022', motif:'roadster' }
];

const VERTEX_PROCESS = [
  { n:'01', title:'Sourcing', tech:'ACQUISITION',
    body:'We acquire rare, highly sought-after donor chassis — air-cooled Porsche 911s, classic Mercedes-Benz SL roadsters, vintage Lamborghini and Ferrari models. Provenance and matching numbers are verified before a car ever reaches the studio.' },
  { n:'02', title:'Strip to bare metal', tech:'RESTORATION',
    body:'Full body and chassis restoration, weight optimisation, bespoke paint finishes. Modern LED lighting is integrated into the original housings — nothing about the silhouette is negotiable.' },
  { n:'03', title:'Engineer the powertrain', tech:'PERFORMANCE',
    body:'Modernised high-output engines, upgraded braking, fully adjustable performance suspension, and a custom stainless exhaust tuned to a signature acoustic profile.' },
  { n:'04', title:'Craft the cabin', tech:'INTERIOR',
    body:'Fully custom cabins in premium full-grain leather and Alcantara, exposed carbon fibre, and discreetly integrated modern amenities — audio and climate control hidden behind period-correct switchgear.' }
];

const VERTEX_GALLERY = [
  { motif:'engine', label:'Project 01', caption:'Engine bay, post-assembly' },
  { motif:'interior', label:'Project 02', caption:'Hand-stitched seat panel' },
  { motif:'gauge', label:'Project 04', caption:'Instrument cluster, recalibrated' },
  { motif:'wheel', label:'Project 01', caption:'Forged three-piece, carbon-ceramic' },
  { motif:'badge', label:'Project 05', caption:'Deck badge, hand-polished' },
  { motif:'exhaust', label:'Project 04', caption:'Twin-outlet, stainless' },
  { motif:'interior', label:'Project 07', caption:'Saddle Tan stitch detail' },
  { motif:'engine', label:'Project 08', caption:'V12 bay, satin-finished' }
];

const VERTEX_FOOTER = [
  { title:'Builds', links:['Available builds','Legacy archive','Commission a build'] },
  { title:'Studio', links:['The craft','Private showroom','Contact'] }
];
