# Nova AI v4.0 — Final Galaxy Build

This build upgrades the existing Nova AI project without replacing its core architecture.

## What was fixed

1. Cinematic launch sequence
The Get Started/Skip action now runs a short shield-break style launch overlay with a glowing core, orbit rings, sparks and a loading bar before the app opens.

2. Mobile sidebar layering
The mobile sidebar is now a true drawer positioned below the app top bar. The top bar stays visible, the drawer does not blur the page, and the rest of the app is locked from accidental scrolling while the drawer is open.

3. Image Studio diagnostics
A Test image server button was added to Settings. It checks the included Cloudflare image health function before generation.

4. GitHub Pages image architecture
GitHub Pages is static. It cannot execute the Netlify Functions included in this project. For secure image generation, deploy the same repository to Netlify and put the Netlify site URL into Settings → Serverless Proxy URL. The image function then calls Cloudflare FLUX server-side.

5. Netlify-hosted convenience
If Nova itself is opened from a `*.netlify.app` host, the app automatically uses that site as the serverless proxy, so the URL field is not required there.

6. AI routing preserved
Auto / Best continues to use the configured Cloudflare GLM 4.7 Flash, Groq GPT-OSS 120B/20B and OpenRouter Free fallback paths. Provider limits still apply.

7. Pro remains a local/demo activation
The ₹30/month Nova Pro card and the display name `Deepak Dee` remain a non-transactional preview. This build does not collect or process real payments.

## Secure deployment

Keep these values only in the Netlify environment settings:

CF_API_TOKEN
CF_ACCOUNT_ID
GROQ_API_KEY (optional if the app uses the serverless Groq route in a future extension)
OPENROUTER_API_KEY

Do not commit API keys to GitHub or paste them into public source files.

## Cloudflare image model

The serverless image function uses:

@cf/black-forest-labs/flux-1-schnell

The Cloudflare API accepts prompts up to 2048 characters and the model supports up to 8 steps. The function already clamps these values safely.

## Important capability note

The current project can provide real AI chat, research through the configured provider path, coding assistance, voice browser APIs, file/text context and real Cloudflare FLUX image generation when the serverless proxy is deployed correctly.

The Video Gen button intentionally produces a production-ready video concept/storyboard through the AI model rather than pretending that a video-generation model is available in the configured provider set.

## Deployment checks

After deploying to Netlify:

1. Confirm Functions shows `cloudflare-image`, `cloudflare-image-health`, `cloudflare-chat`, and `openrouter-chat`.
2. Confirm `CF_API_TOKEN` and `CF_ACCOUNT_ID` are configured for Functions runtime.
3. Redeploy after changing environment variables.
4. Open `/.netlify/functions/cloudflare-image-health` on the Netlify site. A healthy response reports `ok: true`.
5. On the GitHub Pages app, enter the Netlify site URL under Serverless Proxy URL.
6. Use Settings → Test image server before generating the first image.

## Verification performed for this ZIP

JavaScript syntax checks passed for the app and all included Netlify functions.
The HTML ID integrity check passed with unique IDs.
The Cloudflare image function was exercised with a mocked upstream response and returned the expected data URI shape.
The project was scanned for accidental API-key literals; none were found.
