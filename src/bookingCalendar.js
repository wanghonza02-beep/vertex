/* Date math + live booking/slot-locking state for the booking flow's Step 1
   (src/consultationView.js). Local-time Date construction throughout — new
   Date(y, m, d), never new Date("YYYY-MM-DD") or .toISOString() — because
   the ISO/UTC forms shift by a day depending on the visitor's timezone, a
   classic source of "the 22nd highlights as the 21st" bugs.

   Real backend: `availability` below is an in-memory cache keyed by
   dateKey() and then by location, populated by loadAvailability() from two
   Supabase tables — consultations (status='confirmed') and blocked_dates
   (manual closures). Each Atelier location has its own independent
   calendar — a booked slot in Miami has no effect on the same date/time in
   Tokyo — enforced in Postgres itself (a unique index + trigger scoped by
   location, see supabase/schema.sql). This cache only drives what the UI
   shows as taken; it is never the source of truth, since two browsers'
   caches can go briefly stale relative to each other. */

import { supabase } from './supabaseClient.js';

export const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Matches the DB's location CHECK constraint exactly (supabase/schema.sql).
export const LOCATIONS = ['Prague', 'Miami', 'Shanghai', 'Tokyo', 'Los Angeles'];

export const FLEET_BLOCKS = [
  { id: '09:00-12:00', label: '09:00 AM — 12:00 PM' },
  { id: '12:00-15:00', label: '12:00 PM — 03:00 PM' },
  { id: '15:00-18:00', label: '03:00 PM — 06:00 PM' },
];
// id matches the DB's time_slot CHECK constraint exactly (supabase/schema.sql).
export const BESPOKE_BLOCK = { id: 'FULL_DAY', label: 'Full-Day Private Atelier Allocation (09:00 AM — 06:00 PM)' };

export function dateKey(date) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}
export function isSameDay(a, b) {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
export function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
export function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}
export function formatMonthYear(date) { return MONTH_LABELS[date.getMonth()] + ' ' + date.getFullYear(); }
export function formatShortDate(date) { return MONTH_LABELS[date.getMonth()].slice(0, 3).toUpperCase() + ' ' + date.getDate(); }

// 6 weeks x 7 days, padded with the trailing days of the previous month and
// the leading days of the next so the grid is always a full rectangle —
// same shape as the reference screenshot (dimmed 26-31/30 31 1-5 padding
// cells either side of the in-month ones).
export function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - first.getDay());
  const weeks = [];
  const cursor = new Date(gridStart);
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push({ date: new Date(cursor), inMonth: cursor.getMonth() === month });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}
// The exact padded range a rendered month grid spans, so
// loadAvailability() fetches enough to cover the dimmed spillover days too.
export function monthGridRange(viewMonth) {
  const weeks = buildMonthGrid(viewMonth.getFullYear(), viewMonth.getMonth());
  const days = weeks.flat();
  return { start: days[0].date, end: days[days.length - 1].date };
}

function emptyRec() { return { fleet: [], bespoke: false, blocked: false, blockedReason: null }; }

// Seeded once, only when Supabase isn't configured yet, so the locking UI
// still has something to show rather than looking broken before .env.local
// is set up (see Step 1 instructions). Both seeded in Prague only, so
// switching the location dropdown to any other city visibly shows an empty
// (fully available) calendar — proof the per-location split works even in
// demo mode.
function demoAvailability(viewMonth) {
  const today = startOfToday();
  const plus = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return dateKey(d); };
  return {
    [plus(3)]: { Prague: { ...emptyRec(), fleet: ['09:00-12:00'] } },
    [plus(6)]: { Prague: { ...emptyRec(), bespoke: true } },
  };
}

let availability = {};

// Called on every consultation-view open and every month navigation
// (src/consultationView.js) — merges the fetched range into the cache
// rather than replacing it wholesale, so a month you've already viewed
// this session doesn't need to be re-fetched to stay locked correctly.
// Fetches every location in one query (not filtered to the currently
// selected one) so switching the location dropdown re-renders instantly
// from cache instead of needing a re-fetch.
export async function loadAvailability(viewMonth) {
  const { start, end } = monthGridRange(viewMonth);

  if (!supabase) {
    availability = { ...availability, ...demoAvailability(viewMonth) };
    return;
  }

  const startKey = dateKey(start);
  const endKey = dateKey(end);

  const [{ data: rows, error: consultError }, { data: blocked, error: blockedError }] = await Promise.all([
    supabase.from('consultations').select('booking_date, time_slot, location')
      .eq('status', 'confirmed').gte('booking_date', startKey).lte('booking_date', endKey),
    // Overlap test (a range that started before this month or ends after
    // it still covers some days inside it): the row's start must be at or
    // before the grid's end, AND its end must be at or after the grid's start.
    supabase.from('blocked_dates').select('start_date, end_date, reason, location')
      .lte('start_date', endKey).gte('end_date', startKey),
  ]);
  if (consultError) console.error('Failed to load consultations:', consultError);
  if (blockedError) console.error('Failed to load blocked dates:', blockedError);

  const next = {};
  const recFor = (dateStr, location) => {
    const byLocation = next[dateStr] || (next[dateStr] = {});
    return byLocation[location] || (byLocation[location] = emptyRec());
  };
  (rows || []).forEach((row) => {
    const rec = recFor(row.booking_date, row.location);
    if (row.time_slot === 'FULL_DAY') rec.bespoke = true;
    else rec.fleet.push(row.time_slot);
  });
  (blocked || []).forEach((row) => {
    // 'All' closes every city for that period, not just one.
    const locations = row.location === 'All' ? LOCATIONS : [row.location];
    // Parsed as local dates (never new Date("YYYY-MM-DD"), which is UTC and
    // can land on the wrong day depending on the visitor's timezone — same
    // reasoning as dateKey()/isSameDay() above), then clamped to the
    // visible grid range before iterating so a closure spanning months
    // doesn't loop further than what's actually being rendered.
    const parseLocal = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
    const rangeStart = parseLocal(row.start_date);
    const rangeEnd = parseLocal(row.end_date);
    const from = rangeStart < start ? start : rangeStart;
    const to = rangeEnd > end ? end : rangeEnd;
    for (let cursor = new Date(from); cursor <= to; cursor.setDate(cursor.getDate() + 1)) {
      const key = dateKey(cursor);
      locations.forEach((loc) => {
        const rec = recFor(key, loc);
        rec.blocked = true;
        rec.blockedReason = row.reason || null;
      });
    }
  });

  availability = { ...availability, ...next };
}

export function getDayBooking(date, location) {
  const byLocation = availability[dateKey(date)];
  return (byLocation && byLocation[location]) || emptyRec();
}
export function isFleetSlotBooked(date, location, slotId) {
  const rec = getDayBooking(date, location);
  return rec.blocked || rec.bespoke || rec.fleet.includes(slotId);
}
// Mutual day-locking, scoped to one city: a Bespoke session already booked
// there (or a manual blocked_dates closure) locks out every Fleet slot in
// THAT city, and the reverse — ANY Fleet slot already taken there locks out
// Bespoke for that city's date, even if two of the three Fleet blocks are
// still free. Has no effect on any other location's calendar.
export function isBespokeAvailable(date, location) {
  const rec = getDayBooking(date, location);
  return !rec.blocked && !rec.bespoke && rec.fleet.length === 0;
}
export function isDayFullyBespoke(date, location) {
  const rec = getDayBooking(date, location);
  return rec.blocked || rec.bespoke === true;
}
export function getBlockedReason(date, location) {
  return getDayBooking(date, location).blockedReason;
}
// Distinguishes an admin closure (blocked_dates) from a real sold-out
// Bespoke booking — both make isDayFullyBespoke() true, but the frontend
// shows different copy for each ("Atelier closed" vs "fully allocated").
export function isDateBlocked(date, location) {
  return getDayBooking(date, location).blocked === true;
}

// Fetched once per consultation-view open (src/consultationView.js) to
// populate Step 2's fleet dropdown. Returns null (not []) when Supabase
// isn't configured, so the caller can tell "not connected yet" apart from
// "connected, but nothing marked available."
export async function fetchAvailableFleetCars() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('fleet_cars')
    .select('id, brand, project_name')
    .eq('is_available', true)
    .order('brand', { ascending: true });
  if (error) { console.error('Failed to load fleet catalog:', error); return []; }
  return data || [];
}

// POSTs to api/checkout.js, which creates a Stripe Checkout Session and
// hands back its redirect URL. Nothing gets written to Supabase here or by
// that route — api/webhooks/stripe.js is the only writer, and only after
// Stripe confirms the card was actually charged (see supabase/schema.sql:
// the direct-insert policy from the pre-Stripe step is removed once this
// exists, so a slot can only ever lock through a real payment).
export async function startCheckout(payload) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.url) throw new Error(data.error || 'Unable to start checkout');
  return data.url;
}
