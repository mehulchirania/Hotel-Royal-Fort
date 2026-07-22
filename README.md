# Hotel Royal Fort, Ballari

Marketing site and enquiry backend for Hotel Royal Fort. A Vite + React front end
served by a small Express server, deployed on Firebase App Hosting.

**Live:** https://hotelroyalfort.in

**Stack:** React 19 · Vite 6 · Tailwind CSS v4 · Motion · Express · Firestore ·
Resend (email) · Firebase App Hosting.

## Run locally

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev          # front end only, http://localhost:3000
```

To run the full stack (Express serving the built bundle plus the API):

```bash
npm run build
npm start            # http://localhost:8080
```

Copy `.env.example` to `.env` and fill it in for local API work. Firestore access
locally needs Application Default Credentials (`gcloud auth application-default
login`); without them the site still serves and only the engagement endpoints
return 503.

## Images

Source photos live in `assets/images-src/` — deliberately **outside** `public/`,
so the multi-megabyte originals are never shipped. After adding or replacing one:

```bash
npm run optimize:images
```

This writes responsive WebP variants plus a social card into `public/images/` and
regenerates `src/data/images.generated.ts`. Components reference images by name
through `<Img name="hotel-room" />` — never by raw path.

## Deployment

Pushing to `main` triggers a Firebase App Hosting rollout automatically (backend
`royalfort`, region `us-east4`). App Hosting runs `npm run build`, then `npm start`,
so the same service serves both the static bundle and `/api/**`.

Runtime configuration comes from `apphosting.yaml`. Secrets are stored in Google
Secret Manager, never in the repo:

```bash
firebase apphosting:secrets:set RESEND_API_KEY --force
firebase apphosting:secrets:set ENGAGEMENT_ADMIN_TOKEN --force
firebase apphosting:secrets:set ENGAGEMENT_IP_SALT --force
```

Enquiry email is sent through [Resend](https://resend.com). The `RESEND_FROM`
address (`enquiries@hotelroyalfort.in`) must belong to a domain verified in the
Resend dashboard, or sends are rejected. If `RESEND_API_KEY` is absent, or a send
fails, `/api/enquiry` returns a non-2xx and the front end drops the guest into a
WhatsApp click-to-chat link pre-filled with their enquiry, so no lead is lost.

WhatsApp is click-to-chat (`wa.me`) links only — there is no server-side
WhatsApp API.

Check what actually landed in the running container:

```
GET /api/health   ->  { ok, mailConfigured, mailProvider, engagementConfigured }
```

## Engagement data

Each visit is recorded in Firestore (collection `engagementVisits`): page,
referrer, UTM parameters, device and browser hints, a salted IP hash, and precise
latitude/longitude only when the visitor explicitly allows browser location
access. Security rules deny all direct client access — only the server writes,
via the Admin SDK.

With `ENGAGEMENT_ADMIN_TOKEN` set:

- Dashboard — `/admin/engagement?token=...`
- CSV export — `/api/engagement/visits.csv?token=...`

Because this collects visitor location and a derived IP identifier, keep the
privacy policy in `src/data/legal.ts` accurate if you change what is captured.
