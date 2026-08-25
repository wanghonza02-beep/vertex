import { observeReveal } from './panelReveal.js';

/* Privacy Policy / Terms of Service / Cookie Settings — three lightweight
   static pages sharing one panel shell (.webgl-legal-view), the same
   "one template, per-item content" pattern src/detailView.js uses for cars
   rather than three separate view containers. Reachable only from a footer
   link (Our Philosophy's and Consultation's footers both carry the same
   three), so — like Consultation's own back button — "Back" always lands
   on Fleet rather than trying to restore whichever page it was opened
   from; src/main.js owns that closing behavior for the same reason it
   owns Consultation's and the car detail page's.

   Content here is standard boilerplate written for this project, not
   legal counsel-reviewed copy — same placeholder spirit as the rest of
   Vertex's invented business facts (founding year, scarcity numbers). */

const LEGAL_CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    meta: 'Effective January 2026',
    body: [
      { heading: 'What we collect', text: 'When you submit the consultation form or the fleet inquiry form, we collect the information you provide directly — your name, contact details, preferred atelier location, and any notes about the build or vehicle you’re interested in. We don’t collect anything beyond what you choose to submit.' },
      { heading: 'How we use it', text: 'Information submitted through our forms is used only to review your application, schedule a private consultation, and follow up on that conversation. We don’t sell, rent, or share it with third parties for marketing purposes.' },
      { heading: 'Cookies and tracking', text: 'This site does not use advertising or third-party tracking cookies. See Cookie Settings for the full detail.' },
      { heading: 'Data retention', text: 'We retain consultation and inquiry submissions for as long as reasonably necessary to respond to them and maintain a record of past applications. You can request that your information be deleted at any time.' },
      { heading: 'Your rights', text: 'To review, correct, or request deletion of any information you’ve submitted, contact us at enquiries@vertex-atelier.com.' },
    ],
  },
  terms: {
    title: 'Terms of Service',
    meta: 'Effective January 2026',
    body: [
      { heading: 'Browsing the fleet', text: 'The Fleet library and each build’s detail page are presented for informational purposes. Nothing shown constitutes an offer for sale, and availability is not guaranteed until confirmed directly by the atelier.' },
      { heading: 'Consultation applications', text: 'Submitting the Acquire or Commission form requests a private consultation session — it is an application, not a purchase, reservation, or contract. The associated $2,000 USD commitment is only requested once a session is confirmed, and is fully credited toward your final vehicle allocation should you proceed.' },
      { heading: 'How transactions are conducted', text: 'All vehicle commissions, fleet allocations, and related transactions are conducted strictly in person within our atelier, via private escrow contracts. Nothing on this site constitutes such a contract.' },
      { heading: 'Intellectual property', text: 'The Vertex name, mark, and all imagery, video, and copy on this site are the property of Vertex Atelier and may not be reproduced without permission.' },
      { heading: 'Limitation of liability', text: 'This site and its content are provided as-is, without warranty of any kind. Vertex Atelier is not liable for any decisions made on the basis of information presented here.' },
    ],
  },
  cookies: {
    title: 'Cookie Settings',
    meta: 'Effective January 2026',
    body: [
      { heading: 'Our approach', text: 'This site does not use advertising, analytics, or third-party tracking cookies. Nothing here builds an advertising profile, and nothing is sold or shared with ad networks.' },
      { heading: 'Essential storage', text: 'A small amount of information may be stored locally in your browser purely to support the site’s own functionality — for instance, remembering an in-progress interaction. This never leaves your device and isn’t used for tracking.' },
      { heading: 'Your control', text: 'Because we don’t set tracking cookies, there’s no consent preference to manage here. You can clear any locally stored data at any time through your browser’s own settings.' },
      { heading: 'Questions', text: 'If our cookie practices ever change, this page will be updated to reflect it. Questions in the meantime can be sent to enquiries@vertex-atelier.com.' },
    ],
  },
};

let isOpen = false;
let revealObserver = null;

function replayHeroEntrance(view) {
  const hero = view.querySelector('.legal-hero');
  if (!hero) return;
  hero.classList.remove('legal-animate-in');
  void hero.offsetWidth; // reflow — flushes the removal before re-adding in the same tick
  hero.classList.add('legal-animate-in');
}

function sectionHTML(section) {
  return (
    '<div class="legal-section">' +
      '<h2 class="legal-section-title">' + section.heading + '</h2>' +
      '<p class="legal-section-body">' + section.text + '</p>' +
    '</div>'
  );
}

function renderLegalHTML(page) {
  const data = LEGAL_CONTENT[page];
  return (
    '<section class="legal-hero">' +
      '<p class="phi-eyebrow">Legal</p>' +
      '<h1 class="legal-title">' + data.title + '</h1>' +
      '<p class="legal-meta">' + data.meta + '</p>' +
      '<p class="booking-demo-disclaimer legal-demo-disclaimer"><strong>Demo Project</strong> — This is a fictional company built for web design purposes only. The policy below is placeholder copy, not real legal counsel-reviewed terms.</p>' +
    '</section>' +
    '<section class="legal-body">' + data.body.map(sectionHTML).join('') + '</section>'
  );
}

export function isLegalOpen() { return isOpen; }

export function openLegal(stage, page) {
  const view = stage.querySelector('[data-legal-view]');
  const content = stage.querySelector('[data-legal-content]');
  const root = stage.querySelector('[data-legal-scroll]');
  if (!view || !content || !LEGAL_CONTENT[page]) return;
  content.innerHTML = renderLegalHTML(page);
  isOpen = true;
  stage.classList.add('is-legal-view');
  view.setAttribute('aria-hidden', 'false');
  if (root) root.scrollTop = 0;
  replayHeroEntrance(view);

  // Content is rebuilt from scratch on every open (innerHTML), same as
  // src/detailView.js — fresh nodes start at their resting opacity:0
  // automatically, so no separate reset pass is needed before observing.
  if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
  if (root) {
    const sections = Array.from(content.querySelectorAll('.legal-section'));
    revealObserver = observeReveal(root, sections);
  }
}

export function closeLegal(stage) {
  if (!isOpen) return;
  isOpen = false;
  if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
  stage.classList.remove('is-legal-view');
  const view = stage.querySelector('[data-legal-view]');
  if (view) view.setAttribute('aria-hidden', 'true');
}

// Only wires what's intrinsic to this page's own content (icons) — same
// split as consultationView.js's initConsultationView. The back button is
// wired in src/main.js instead, matching the same reasoning as the car
// detail page's back button: it needs syncGridPause(stage, gridRef), which
// only exists in main.js's scope.
export function initLegalView(stage) {
  const view = stage.querySelector('[data-legal-view]');
  if (!view) return;
  window.VertexIcons && window.VertexIcons.refresh(view);
}
