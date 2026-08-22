import { observeReveal, resetStatFigure, bindBackButtonScrollFade } from './panelReveal.js';
import {
  WEEKDAY_LABELS, FLEET_BLOCKS, BESPOKE_BLOCK, LOCATIONS,
  dateKey, isSameDay, startOfToday, addMonths, formatMonthYear, formatShortDate, buildMonthGrid,
  isFleetSlotBooked, isBespokeAvailable, isDayFullyBespoke, getBlockedReason, isDateBlocked,
  loadAvailability, fetchAvailableFleetCars, startCheckout,
} from './bookingCalendar.js';

/* "Acquire or Commission" — the Private Atelier booking page. Opened from
   the header's pill, reachable from ANY other view (see css/webgl-grid.css
   for why it sits at content z-index 9). Static shell — like Our
   Philosophy, not per-item data like a car detail page — so this resets
   and re-observes the same persistent DOM on every open (see
   enterConsultationView). src/main.js owns the back button and Escape
   handling, and calls openConsultation/closeConsultation here.

   The booking flow itself (Steps 1-3, [data-booking-step-body]) IS rebuilt
   per render, same reasoning as src/detailView.js's per-car innerHTML swap:
   this is genuinely dynamic content (which slots are booked, which step is
   active), not static editorial copy, and a full re-render on every state
   change is simpler and more robust than incrementally patching the
   calendar/slot DOM by hand. One click/change/submit listener on the step
   body (attached once in initConsultationView) handles every step via
   event delegation, since the buttons/inputs inside it are replaced on
   every render. */

let isOpen = false;
let revealObserver = null;

// step: 1 = date+slot, 2 = path details, 3 = contact + pay. Submitting Step 3
// redirects to Stripe Checkout (see handleBookingSubmit) — there's no local
// "success" step, since Stripe itself redirects the browser to
// public/success.html once payment completes.
// viewMonth: first-of-month currently shown in the calendar (independent of
// selectedDate, so browsing months doesn't lose a prior selection in a
// different month — though picking a new date does clear selectedSlot,
// since a slot from the old date no longer means anything).
// loadingAvailability/fleetCars: both fetched from Supabase on open (and
// loadingAvailability again on every month nav) — see enterConsultationView.
// fleetCars is null while loading, [] once loaded-but-empty, so Step 2 can
// tell those two states apart.
let bookingState = null;

function freshBookingState() {
  return {
    step: 1, viewMonth: startOfToday(), location: LOCATIONS[0], selectedDate: null, selectedSlot: null, selectedFleetCarId: null,
    loadingAvailability: false, fleetCars: null,
  };
}

function slotTimeRangeText(slot) {
  return slot.type === 'bespoke' ? '09:00-18:00' : slot.id;
}
function slotFee(slot) {
  return slot.type === 'bespoke' ? 2500 : 500;
}
function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function renderCalendarHTML(state) {
  const today = startOfToday();
  const weeks = buildMonthGrid(state.viewMonth.getFullYear(), state.viewMonth.getMonth());
  const dayCells = weeks.flat().map((cell) => {
    const isPast = cell.date < today;
    const disabled = !cell.inMonth || isPast;
    const classes = ['booking-cal-day'];
    if (!cell.inMonth) classes.push('is-outside');
    if (isSameDay(cell.date, today)) classes.push('is-today');
    if (state.selectedDate && isSameDay(cell.date, state.selectedDate)) classes.push('is-selected');
    const label = cell.date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    return '<button type="button" class="' + classes.join(' ') + '"' +
      (disabled ? ' disabled' : ' data-cal-day="' + dateKey(cell.date) + '" aria-label="' + label + '"') +
      '>' + cell.date.getDate() + '</button>';
  }).join('');

  return (
    '<div class="booking-calendar">' +
      '<div class="booking-cal-head">' +
        '<button type="button" class="booking-cal-nav" data-cal-prev aria-label="Previous month"><i data-lucide="chevron-left" aria-hidden="true"></i></button>' +
        '<span class="booking-cal-month">' + formatMonthYear(state.viewMonth) + '</span>' +
        '<button type="button" class="booking-cal-nav" data-cal-next aria-label="Next month"><i data-lucide="chevron-right" aria-hidden="true"></i></button>' +
      '</div>' +
      '<div class="booking-cal-weekdays">' + WEEKDAY_LABELS.map((d) => '<span>' + d + '</span>').join('') + '</div>' +
      '<div class="booking-cal-grid">' + dayCells + '</div>' +
    '</div>'
  );
}

function slotButtonHTML(type, block, booked, selected, tag) {
  return (
    '<button type="button" class="booking-slot' + (type === 'bespoke' ? ' booking-slot--bespoke' : '') + (booked ? ' is-booked' : '') + (selected ? ' is-selected' : '') + '"' +
      (booked ? ' disabled' : ' data-slot-type="' + type + '" data-slot-id="' + block.id + '"') +
    '>' +
      '<span>' + block.label + '</span>' +
      (tag ? '<span class="booking-slot-tag">' + tag + '</span>' : '') +
    '</button>'
  );
}

function renderTimesHTML(state) {
  if (state.loadingAvailability) {
    return '<div class="booking-times"><h3 class="booking-times-title">Available Times</h3><p class="booking-times-empty">Loading live availability…</p></div>';
  }
  if (!state.selectedDate) {
    return '<div class="booking-times"><h3 class="booking-times-title">Available Times</h3><p class="booking-times-empty">Select a date to see availability.</p></div>';
  }
  const date = state.selectedDate;

  if (isDayFullyBespoke(date, state.location)) {
    const reason = getBlockedReason(date, state.location);
    const message = isDateBlocked(date, state.location)
      ? 'ATELIER CLOSED' + (reason ? ' — ' + reason.toUpperCase() : '')
      : 'FULLY ALLOCATED — PRIVATE ATELIER SESSION';
    return (
      '<div class="booking-times"><h3 class="booking-times-title">Available Times</h3>' +
        '<div class="booking-slot booking-slot--full" aria-disabled="true"' + (reason ? ' title="' + escapeAttr(reason) + '"' : '') + '>' + escapeAttr(message) + '</div>' +
      '</div>'
    );
  }

  const fleetHTML = FLEET_BLOCKS.map((block) => {
    const booked = isFleetSlotBooked(date, state.location, block.id);
    const selected = !!(state.selectedSlot && state.selectedSlot.type === 'fleet' && state.selectedSlot.id === block.id);
    return slotButtonHTML('fleet', block, booked, selected, booked ? 'BOOKED' : '');
  }).join('');

  const bespokeAvailable = isBespokeAvailable(date, state.location);
  const bespokeSelected = !!(state.selectedSlot && state.selectedSlot.type === 'bespoke');
  const bespokeHTML = slotButtonHTML('bespoke', BESPOKE_BLOCK, !bespokeAvailable, bespokeSelected, !bespokeAvailable ? 'UNAVAILABLE' : '');

  return (
    '<div class="booking-times">' +
      '<h3 class="booking-times-title">Available Times</h3>' +
      '<div class="booking-slot-group"><p class="booking-slot-group-label">Fleet Acquisition — $500 USD</p>' + fleetHTML + '</div>' +
      '<div class="booking-slot-group"><p class="booking-slot-group-label">Bespoke Commission — $2,500 USD</p>' + bespokeHTML + '</div>' +
    '</div>'
  );
}

// Each Atelier location has its own independent calendar (a booking in
// Miami has no effect on Tokyo's availability) — see bookingCalendar.js's
// loadAvailability, which already fetches every location for the visible
// month in one query, so switching this re-renders instantly with no
// extra fetch.
function renderLocationHTML(state) {
  const options = LOCATIONS.map((loc) =>
    '<option value="' + loc + '"' + (state.location === loc ? ' selected' : '') + '>' + loc + '</option>'
  ).join('');
  return (
    '<div class="consultation-field booking-location-field">' +
      '<label for="bLocation">Atelier location</label>' +
      '<div class="select-wrap"><select id="bLocation" data-location-select>' + options + '</select></div>' +
    '</div>'
  );
}

function renderStep1HTML(state) {
  return '<div class="booking-step1">' + renderLocationHTML(state) + renderCalendarHTML(state) + renderTimesHTML(state) + '</div>';
}

function renderStep2HTML(state) {
  const isFleet = state.selectedSlot.type === 'fleet';
  let detailHTML;
  let canContinue = true;

  if (isFleet) {
    if (state.fleetCars === null) {
      detailHTML = '<p class="booking-step2-note">Loading available models…</p>';
      canContinue = false;
    } else if (state.fleetCars.length === 0) {
      detailHTML = '<p class="booking-step2-note">No fleet models are currently available for private inspection — please check back soon.</p>';
      canContinue = false;
    } else {
      const fleetOptions = state.fleetCars.map((car) =>
        '<option value="' + escapeAttr(car.project_name) + '"' + (state.selectedFleetCarId === car.project_name ? ' selected' : '') + '>' + car.brand + ' — ' + car.project_name + '</option>'
      ).join('');
      detailHTML = (
        '<div class="consultation-field">' +
          '<label for="bFleetCar">Select your fleet model</label>' +
          '<div class="select-wrap"><select id="bFleetCar" data-fleet-car-select>' +
            '<option value="">Select…</option>' + fleetOptions +
          '</select></div>' +
        '</div>'
      );
      canContinue = !!state.selectedFleetCarId;
    }
  } else {
    detailHTML = '<p class="booking-step2-note">No further selection needed — your Bespoke Commission session covers full tailoring from a blank sheet. Continue to confirm your details.</p>';
  }

  return (
    '<div class="booking-step2">' +
      '<div class="booking-summary-card">' +
        '<span class="booking-summary-option">' + state.location + ' — Option ' + (isFleet ? 'A' : 'B') + ': ' + (isFleet ? 'Fleet Acquisition &amp; Private Inspection' : 'Bespoke Commission &amp; Full Tailoring') + '</span>' +
        '<span class="booking-summary-fee">$' + slotFee(state.selectedSlot).toLocaleString('en-US') + ' USD</span>' +
      '</div>' +
      detailHTML +
      '<div class="booking-step-actions">' +
        '<button type="button" class="webgl-pill" data-step-back="1"><i data-lucide="arrow-left" aria-hidden="true"></i> Back</button>' +
        '<button type="button" class="consultation-cta" data-step-continue="3"' + (!canContinue ? ' disabled' : '') + '>Continue</button>' +
      '</div>' +
    '</div>'
  );
}

function renderStep3HTML(state) {
  const ctaLabel = 'RESERVE ' + formatShortDate(state.selectedDate) + ' (' + slotTimeRangeText(state.selectedSlot) + ') — $' + slotFee(state.selectedSlot).toLocaleString('en-US') + ' USD';
  return (
    '<form class="booking-step3" data-booking-form novalidate>' +
      '<div class="consultation-field"><label for="bName">Full name</label><input id="bName" name="fullName" type="text" required autocomplete="name" placeholder="Your full name"></div>' +
      '<div class="consultation-field"><label for="bPhone">Direct phone number</label><input id="bPhone" name="phone" type="tel" required autocomplete="tel" placeholder="+1 555 010 0142"></div>' +
      '<div class="consultation-field"><label for="bEmail">Encrypted email</label><input id="bEmail" name="email" type="email" required autocomplete="email" placeholder="you@example.com"></div>' +
      '<p class="booking-demo-disclaimer"><strong>Demo Project</strong> — This is a fictional company built for web design purposes only. The next step uses Stripe\'s test mode: no real charge occurs, so please don\'t enter genuine personal or payment details.</p>' +
      '<div class="booking-step-actions">' +
        '<button type="button" class="webgl-pill" data-step-back="2"><i data-lucide="arrow-left" aria-hidden="true"></i> Back</button>' +
        '<button type="submit" class="consultation-cta" data-booking-submit>' + ctaLabel + '</button>' +
      '</div>' +
    '</form>'
  );
}

function updateStepIndicator(stage, step) {
  const dots = stage.querySelectorAll('[data-step-dot]');
  dots.forEach((dot) => {
    const n = Number(dot.getAttribute('data-step-dot'));
    dot.classList.toggle('is-active', n === step);
    dot.classList.toggle('is-complete', n < step);
  });
}

function renderBookingFlow(stage) {
  const container = stage.querySelector('[data-booking-step-body]');
  if (!container || !bookingState) return;
  if (bookingState.step === 1) container.innerHTML = renderStep1HTML(bookingState);
  else if (bookingState.step === 2) container.innerHTML = renderStep2HTML(bookingState);
  else container.innerHTML = renderStep3HTML(bookingState);
  updateStepIndicator(stage, bookingState.step);
  window.VertexIcons && window.VertexIcons.refresh(container);
}

// Submitting Step 3 creates a Stripe Checkout Session (api/checkout.js) and
// redirects the browser straight to Stripe's hosted payment page — this
// function never marks a slot reserved itself. The consultations row (and
// therefore the slot actually locking) only gets created by
// api/webhooks/stripe.js once Stripe confirms the card was charged, so an
// abandoned or cancelled checkout can never fake a reservation.
function handleBookingSubmit(stage, form) {
  const submitBtn = form.querySelector('[data-booking-submit]');
  if (!submitBtn) return;
  const original = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Redirecting to secure payment…';

  const formData = new FormData(form);
  const payload = {
    client_name: formData.get('fullName'),
    client_email: formData.get('email'),
    client_phone: formData.get('phone'),
    path_type: bookingState.selectedSlot.type,
    selected_car: bookingState.selectedSlot.type === 'fleet' ? bookingState.selectedFleetCarId : null,
    booking_date: dateKey(bookingState.selectedDate),
    time_slot: bookingState.selectedSlot.id,
    location: bookingState.location,
  };

  startCheckout(payload)
    .then((url) => { window.location.href = url; })
    .catch((err) => {
      console.error('Checkout redirect failed:', err);
      window.VertexToast && window.VertexToast.show(
        err.message || 'Something went wrong starting checkout — please try again.',
        'error'
      );
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    });
}

// Same remove/reflow/re-add restart trick as src/main.js's
// replayHeroEntrance for Our Philosophy — a class already present when
// re-added doesn't restart a CSS animation.
function replayHeroEntrance(view) {
  const hero = view.querySelector('.consultation-hero');
  if (!hero) return;
  hero.classList.remove('consultation-animate-in');
  void hero.offsetWidth; // reflow — flushes the removal before re-adding in the same tick
  hero.classList.add('consultation-animate-in');
}

function enterConsultationView(stage) {
  const view = stage.querySelector('[data-consultation-view]');
  const root = stage.querySelector('[data-consultation-scroll]');
  if (!view || !root) return;
  root.scrollTop = 0;
  replayHeroEntrance(view);

  bookingState = freshBookingState();
  bookingState.loadingAvailability = true;
  renderBookingFlow(stage);

  // Renders immediately with the loading state above, then re-renders once
  // both live availability and the fleet catalog actually arrive — avoids
  // the calendar/dropdown sitting unresponsive for the round-trip. Guarded
  // by `isOpen` since the visitor may have already closed this view.
  Promise.all([
    loadAvailability(bookingState.viewMonth),
    fetchAvailableFleetCars().then((cars) => { bookingState.fleetCars = cars; }),
  ]).then(() => {
    bookingState.loadingAvailability = false;
    if (isOpen) renderBookingFlow(stage);
  });

  // The VIP hospitality cards are static content (not per-item data like
  // the booking flow above), so they get the same reset+reobserve
  // scroll-reveal treatment as the old Atelier Experience cards did.
  const revealEls = view.querySelectorAll('.consultation-card');
  revealEls.forEach((el) => el.classList.remove('is-revealed'));

  if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
  revealObserver = observeReveal(root, Array.from(revealEls));
}

function leaveConsultationView() {
  if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
}

export function isConsultationOpen() { return isOpen; }

export function openConsultation(stage) {
  const view = stage.querySelector('[data-consultation-view]');
  if (!view) return;
  isOpen = true;
  stage.classList.add('is-consultation-view');
  view.setAttribute('aria-hidden', 'false');
  enterConsultationView(stage);
}

export function closeConsultation(stage) {
  if (!isOpen) return;
  isOpen = false;
  leaveConsultationView();
  stage.classList.remove('is-consultation-view');
  const view = stage.querySelector('[data-consultation-view]');
  if (view) view.setAttribute('aria-hidden', 'true');
}

// Wires only what's intrinsic to this page's own content (icons, the
// booking flow's event delegation). The back button and Escape key are
// wired in src/main.js — see the header comment above for why.
export function initConsultationView(stage) {
  const view = stage.querySelector('[data-consultation-view]');
  if (!view) return;
  window.VertexIcons && window.VertexIcons.refresh(view);
  bindBackButtonScrollFade(view.querySelector('[data-consultation-scroll]'), view.querySelector('[data-consultation-back]'));

  const container = view.querySelector('[data-booking-step-body]');
  if (!container) return;

  // One delegated listener for the whole booking flow — its buttons/inputs
  // are replaced wholesale on every renderBookingFlow() call, so binding to
  // individual elements would mean rebinding after every render; binding to
  // the (stable) container once avoids that entirely.
  container.addEventListener('click', (e) => {
    if (!bookingState) return;

    const prevBtn = e.target.closest('[data-cal-prev]');
    if (prevBtn) {
      bookingState.viewMonth = addMonths(bookingState.viewMonth, -1);
      bookingState.loadingAvailability = true;
      renderBookingFlow(stage);
      loadAvailability(bookingState.viewMonth).then(() => {
        bookingState.loadingAvailability = false;
        if (isOpen) renderBookingFlow(stage);
      });
      return;
    }

    const nextBtn = e.target.closest('[data-cal-next]');
    if (nextBtn) {
      bookingState.viewMonth = addMonths(bookingState.viewMonth, 1);
      bookingState.loadingAvailability = true;
      renderBookingFlow(stage);
      loadAvailability(bookingState.viewMonth).then(() => {
        bookingState.loadingAvailability = false;
        if (isOpen) renderBookingFlow(stage);
      });
      return;
    }

    const dayBtn = e.target.closest('[data-cal-day]');
    if (dayBtn) {
      const [y, m, d] = dayBtn.getAttribute('data-cal-day').split('-').map(Number);
      bookingState.selectedDate = new Date(y, m - 1, d);
      bookingState.selectedSlot = null; // a slot picked for the old date no longer means anything
      renderBookingFlow(stage);
      return;
    }

    const slotBtn = e.target.closest('[data-slot-type]');
    if (slotBtn) {
      bookingState.selectedSlot = { type: slotBtn.getAttribute('data-slot-type'), id: slotBtn.getAttribute('data-slot-id') };
      bookingState.selectedFleetCarId = null;
      bookingState.step = 2;
      renderBookingFlow(stage);
      return;
    }

    const backBtn = e.target.closest('[data-step-back]');
    if (backBtn) { bookingState.step = Number(backBtn.getAttribute('data-step-back')); renderBookingFlow(stage); return; }

    const contBtn = e.target.closest('[data-step-continue]');
    if (contBtn && !contBtn.disabled) { bookingState.step = Number(contBtn.getAttribute('data-step-continue')); renderBookingFlow(stage); }
  });

  container.addEventListener('change', (e) => {
    if (!bookingState) return;

    const locationSelect = e.target.closest('[data-location-select]');
    if (locationSelect) {
      bookingState.location = locationSelect.value;
      bookingState.selectedSlot = null; // a slot picked in the old city no longer means anything
      renderBookingFlow(stage);
      return;
    }

    const select = e.target.closest('[data-fleet-car-select]');
    if (!select) return;
    bookingState.selectedFleetCarId = select.value || null;
    const contBtn = container.querySelector('[data-step-continue]');
    if (contBtn) contBtn.disabled = !select.value;
  });

  container.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-booking-form]');
    if (!form) return;
    e.preventDefault();
    if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;
    handleBookingSubmit(stage, form);
  });
}
