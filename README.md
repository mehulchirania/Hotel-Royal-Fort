<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/32c12220-2fc7-45c5-a8fe-f8d33021b259

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Engagement Data

The production server records each website visit in `data/engagement-visits.csv`.
Rows include page, referrer, UTM parameters, device/browser hints, a hashed IP value,
and precise latitude/longitude only when the visitor allows browser location access.

Set `ENGAGEMENT_ADMIN_TOKEN` in your environment, then download the table from:
`/api/engagement/visits.csv?token=your-secret-token`

You can also view the protected dashboard at:
`/admin/engagement?token=your-secret-token`
