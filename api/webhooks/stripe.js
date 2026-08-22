// Vercel serverless function: POST /api/webhooks/stripe
// Stripe calls this directly (not the browser) once a Checkout Session is
// paid. This is the ONLY place a consultations row gets created — see
// supabase/schema.sql, where the public insert policy from the pre-Stripe
// step is removed once this exists, so a slot can only ever lock after
// money has actually moved.
//
// Uses the service_role key (bypasses RLS) since this is the one trusted
// writer. Signature verification needs the exact raw request bytes, so the
// default body parser is disabled and the body is read by hand below.
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const AMOUNT_BY_PATH = { fleet: 500, bespoke: 2500 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const md = session.metadata || {};

    if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase env vars — cannot record paid booking for session', session.id);
      return res.status(500).json({ error: 'Server is not configured — missing Supabase environment variables.' });
    }
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { error } = await supabase.from('consultations').insert({
      client_name: md.client_name || null,
      client_email: md.client_email || session.customer_details?.email || null,
      client_phone: md.client_phone || null,
      path_type: md.path_type || null,
      selected_car: md.selected_car || null,
      booking_date: md.booking_date || null,
      time_slot: md.time_slot || null,
      location: md.location || null,
      amount_paid: AMOUNT_BY_PATH[md.path_type] || null,
      stripe_payment_id: session.payment_intent || session.id,
      status: 'confirmed',
    });

    if (error) {
      // Stripe retries the webhook on a non-2xx response, so a transient
      // Supabase failure (or a genuine double-booking race, code 23505)
      // isn't silently lost — it just comes back.
      console.error('Supabase insert failed for session', session.id, error);
      return res.status(500).json({ error: 'Database insert failed' });
    }
  }

  return res.status(200).json({ received: true });
}
