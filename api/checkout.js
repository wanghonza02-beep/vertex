// Vercel serverless function: POST /api/checkout
// Creates a Stripe Checkout Session for whichever path the visitor picked
// in Step 3, and hands the frontend back a redirect URL. This route never
// touches Supabase — the booking only gets written by
// api/webhooks/stripe.js once Stripe confirms the card was actually
// charged, so an abandoned or cancelled checkout can never create a
// reservation.
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_CENTS_BY_PATH = { fleet: 50000, bespoke: 250000 };
const LABEL_BY_PATH = {
  fleet: 'Fleet Acquisition — Private Inspection Deposit',
  bespoke: 'Bespoke Commission — Full Tailoring Deposit',
};
const VALID_SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', 'FULL_DAY'];
// Matches the DB's location CHECK constraint exactly (supabase/schema.sql).
const VALID_LOCATIONS = ['Prague', 'Miami', 'Shanghai', 'Tokyo', 'Los Angeles'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { client_name, client_email, client_phone, path_type, selected_car, booking_date, time_slot, location } = req.body || {};

  if (!client_name || !client_email || !client_phone || !booking_date
    || !PRICE_CENTS_BY_PATH[path_type] || !VALID_SLOTS.includes(time_slot) || !VALID_LOCATIONS.includes(location)) {
    return res.status(400).json({ error: 'Missing or invalid booking details' });
  }

  const origin = req.headers.origin || `https://${req.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: client_email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `${location} — ${LABEL_BY_PATH[path_type]}` },
          unit_amount: PRICE_CENTS_BY_PATH[path_type],
        },
        quantity: 1,
      }],
      // Read back by api/webhooks/stripe.js on checkout.session.completed —
      // every field the consultations row needs lives here, since the
      // webhook has no other way to know what the customer selected.
      metadata: { client_name, client_email, client_phone, path_type, selected_car: selected_car || '', booking_date, time_slot, location },
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout session creation failed:', err);
    return res.status(500).json({ error: 'Unable to start checkout' });
  }
}
