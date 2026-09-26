# Nova AI v3.5 Final

This build preserves the existing Nova AI chat and workspaces and fixes the Cloudflare image path for browser deployments.

## Image generation

The app uses Cloudflare Workers AI FLUX.1 schnell:
`@cf/black-forest-labs/flux-1-schnell`

The browser first calls the included same-site Netlify Function:
`/.netlify/functions/cloudflare-image`

This avoids the browser CORS failure that can appear when a static site calls the Cloudflare API directly.

### Netlify setup

In Netlify, open Site configuration → Environment variables and add:

`CF_API_TOKEN` = your current Cloudflare Workers AI API token
`CF_ACCOUNT_ID` = your Cloudflare Account ID

Redeploy the site after adding the variables.

For the Cloudflare token, use a token with the Workers AI permissions required by the current Cloudflare API documentation. Do not put the secret token into this ZIP or commit it to GitHub.

The app also retains the Cloudflare token and Account ID fields in Nova Settings as a direct-request fallback. If direct browser requests are blocked by CORS, the Netlify Function is used first.

## Image behavior

The app keeps the existing four-image-per-day local limit.

The prompt is capped at Cloudflare's documented 2048-character limit.

The app accepts Cloudflare's JSON Base64 image response and image-content response.

A failed request now displays the actual stage of failure rather than only `Failed to fetch`.

## Sidebar

The top-left sidebar button toggles the sidebar open and closed. On mobile, the same control opens/closes the navigation drawer.

## Existing features preserved

Chat, Auto / Best model routing, Groq fallback, history, editing, copy, regeneration, voice, code, research, feature workspaces, settings, welcome screen, India-time greeting, language selection and visual effects remain in the build.

## Security

Never reuse an API token that has been exposed publicly. Rotate exposed tokens and store production secrets in Netlify environment variables or another server-side secret store.
