// Shared Supabase client for all browser-side code. This project is a plain
// Vite/JS app (no TypeScript, no Next.js) — see the JSDoc typedefs below for
// editor autocomplete on the three tables, in place of the .ts interfaces a
// Next.js project would use, and VITE_* env vars in place of NEXT_PUBLIC_*
// (Vite only exposes browser code to vars prefixed VITE_).
//
// `supabase` is null when VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY aren't
// set yet, so callers can check for that and no-op rather than throwing.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

/**
 * @typedef {Object} Consultation
 * @property {string} id
 * @property {string} created_at
 * @property {string} client_name
 * @property {string} client_email
 * @property {string} client_phone
 * @property {'fleet' | 'bespoke'} path_type
 * @property {string | null} selected_car
 * @property {string} booking_date - YYYY-MM-DD
 * @property {'09:00-12:00' | '12:00-15:00' | '15:00-18:00' | 'FULL_DAY'} time_slot
 * @property {500 | 2500} amount_paid
 * @property {string | null} stripe_payment_id
 * @property {'confirmed' | 'completed' | 'cancelled'} status
 */

/**
 * @typedef {Object} FleetCar
 * @property {string} id
 * @property {string} brand
 * @property {string} project_name
 * @property {boolean} is_available
 * @property {string} created_at
 */

/**
 * @typedef {Object} BlockedDate
 * @property {string} id
 * @property {string} blocked_date - YYYY-MM-DD
 * @property {string | null} reason
 * @property {string} created_at
 */
