// Local-only dev server: Vite (the frontend, same as plain `vite`) plus the
// api/*.js Vercel serverless functions, both on ONE port. This exists
// because `vercel dev`'s own reverse proxy has proven unreliable in this
// environment (accepts a connection, never actually responds) — this
// sidesteps that entirely rather than fighting it further. Production
// still deploys through Vercel normally; this file is never used there
// (Vercel doesn't run "npm run dev").
//
// api/*.js files are written against Vercel's Node request/response
// helpers (res.status().json(), req.body, req.query) rather than plain
// Node http — addVercelHelpers()/readJsonBody() below polyfill exactly
// enough of that so the SAME handler files run unmodified both here and
// on a real Vercel deployment.
import { createServer as createViteServer, loadEnv } from 'vite';
import http from 'node:http';

// Vite only loads .env.local into import.meta.env for CLIENT code — a
// plain Node script like this one needs it in process.env instead, and
// needs it set BEFORE the api/*.js modules below are imported, since they
// read process.env at module-load time (e.g. `new Stripe(...)`).
Object.assign(process.env, loadEnv('development', process.cwd(), ''));

const { default: checkoutHandler } = await import('./api/checkout.js');
const { default: sessionHandler } = await import('./api/session.js');
const { default: stripeWebhookHandler } = await import('./api/webhooks/stripe.js');

const API_ROUTES = {
  '/api/checkout': checkoutHandler,
  '/api/session': sessionHandler,
  '/api/webhooks/stripe': stripeWebhookHandler,
};

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (err) { reject(err); }
    });
    req.on('error', reject);
  });
}

function addVercelHelpers(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (body) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); };
  res.send = (body) => { res.end(body); };
}

async function main() {
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const handler = API_ROUTES[url.pathname];

    if (handler) {
      addVercelHelpers(res);
      req.query = Object.fromEntries(url.searchParams);
      // api/webhooks/stripe.js reads the raw body itself (needed for
      // signature verification) — never pre-consume the stream for it.
      if (url.pathname !== '/api/webhooks/stripe' && (req.method === 'POST' || req.method === 'PUT')) {
        try {
          req.body = await readJsonBody(req);
        } catch (err) {
          res.statusCode = 400;
          res.end('Invalid JSON body');
          return;
        }
      }
      try {
        await handler(req, res);
      } catch (err) {
        console.error(`Error handling ${url.pathname}:`, err);
        if (!res.headersSent) { res.statusCode = 500; res.end('Internal Server Error'); }
      }
      return;
    }

    vite.middlewares(req, res);
  });

  const port = Number(process.env.PORT) || 5173;
  server.listen(port, () => {
    console.log(`\n  Vertex dev server (site + api) ready at http://localhost:${port}/\n`);
  });
}

main();
