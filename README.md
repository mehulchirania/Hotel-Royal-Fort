# Hotel Royal Fort, Ballari

Marketing site and enquiry backend for Hotel Royal Fort. A Vite + React front end served by an Express server, deployed on Firebase App Hosting.

- **Live Site:** [https://hotelroyalfort.in](https://hotelroyalfort.in)
- **Admin Dashboard:** [https://hotelroyalfort.in/admin/engagement?token=75a432662ecdfe6a39ef7842efd5bf26](https://hotelroyalfort.in/admin/engagement?token=75a432662ecdfe6a39ef7842efd5bf26)
- **CSV Data Export:** [https://hotelroyalfort.in/api/engagement/visits.csv?token=75a432662ecdfe6a39ef7842efd5bf26](https://hotelroyalfort.in/api/engagement/visits.csv?token=75a432662ecdfe6a39ef7842efd5bf26)
- **Health Check:** [https://hotelroyalfort.in/api/health](https://hotelroyalfort.in/api/health)

### OTA Booking Partners
- **Goibibo Listing:** [Hotel Royal Fort on Goibibo](https://www.goibibo.com/hotels/hotel-details/?checkin=20260606&checkout=20260607&roomString=1-2-0&searchText=Hotel%20Royal%20Fort&locusId=CTBELL&locusType=city&cityCode=CTBELL&cc=IN&_uCurrency=INR&vcid=CTBELL&giHotelId=3415246453017752306&mmtId=20130416155141839&topHtlId=20130416155141839&sType=hotel)
- **MakeMyTrip Listing:** [Hotel Royal Fort on MakeMyTrip](https://www.makemytrip.com/hotels/hotel-details?hotelId=20130416155141839&_uCurrency=INR&checkin=07232026&checkout=07242026&city=CTBELL&country=IN&lat=15.14849&lng=76.90385&locusId=CTBELL&locusType=city&rank=1&regionNearByExp=3&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Hotel%20Royal%20Fort&topHtlId=20130416155141839&viewType=BUDGET)

---

**Stack:** React 19 · Vite 6 · Tailwind CSS v4 · Motion · Express · Firestore · Resend (email) · Firebase App Hosting.

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

Copy `.env.example` to `.env` and fill it in for local API work. Firestore access locally supports `service-account.json` or Application Default Credentials (`gcloud auth application-default login`); without them the site still serves and only the engagement endpoints return 503.

## Images

Source photos live in `assets/images-src/` — deliberately **outside** `public/`, so the multi-megabyte originals are never shipped. After adding or replacing one:

```bash
npm run optimize:images
```

This writes responsive WebP variants plus a social card into `public/images/` and regenerates `src/data/images.generated.ts`. Components reference images by name through `<Img name="hotel-room" />` — never by raw path.

## Deployment

Pushing to `main` triggers a Firebase App Hosting rollout automatically (backend `royalfort`, region `us-east4`). App Hosting runs `npm run build`, then `npm start`, so the same service serves both the static bundle and `/api/**`.

Runtime configuration comes from `apphosting.yaml`. Secrets are stored in Google Secret Manager, never in the repo:

```bash
firebase apphosting:secrets:set RESEND_API_KEY --force
firebase apphosting:secrets:set ENGAGEMENT_ADMIN_TOKEN --force
firebase apphosting:secrets:set ENGAGEMENT_IP_SALT --force
```

Enquiry email is sent through [Resend](https://resend.com). The `RESEND_FROM` address (`enquiries@hotelroyalfort.in`) belongs to the verified domain `hotelroyalfort.in`. If `RESEND_API_KEY` is absent or a send fails, `/api/enquiry` returns a non-2xx and the front end drops the guest into a WhatsApp click-to-chat link pre-filled with their enquiry, so no lead is lost.

WhatsApp is click-to-chat (`wa.me`) links only — zero server-side WhatsApp maintenance overhead.

Check what actually landed in the running container:

```
GET /api/health   ->  { ok, mailConfigured, mailProvider, engagementConfigured }
```

## Engagement data

Each visit is recorded in Firestore (collection `engagementVisits`): page, referrer, UTM parameters, device and browser hints, a salted IP hash, and precise latitude/longitude only when the visitor explicitly allows browser location access. Security rules deny all direct client access — only the server writes, via the Admin SDK.

With `ENGAGEMENT_ADMIN_TOKEN` set:

- Dashboard — `/admin/engagement?token=75a432662ecdfe6a39ef7842efd5bf26`
- CSV export — `/api/engagement/visits.csv?token=75a432662ecdfe6a39ef7842efd5bf26`

Because this collects visitor location and a derived IP identifier, keep the privacy policy in `src/data/legal.ts` accurate if you change what is captured.
