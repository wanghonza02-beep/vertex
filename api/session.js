// Vercel serverless function: GET /api/session?session_id=cs_...
// Lets success.html show what was actually booked instead of a generic
// "thanks" message. Only ever reads a Checkout Session Stripe itself just
// redirected the browser back with — never trusts client-supplied booking
// details directly.
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { session_id } = req.query;
  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed' });
    }

    const md = session.metadata || {};
    return res.status(200).json({
      client_name: md.client_name || null,
      path_type: md.path_type || null,
      booking_date: md.booking_date || null,
      time_slot: md.time_slot || null,
      location: md.location || null,
      selected_car: md.selected_car || null,
      amount_total: session.amount_total,
    });
  } catch (err) {
    console.error('Stripe session retrieval failed:', err);
    return res.status(404).json({ error: 'Session not found' });
  }
}
