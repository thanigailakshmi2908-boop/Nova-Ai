# Nova AI

This ZIP is the v4.0 final galaxy build. See `README-V4.0-FINAL.md` for the fixes, deployment architecture and verification notes.

# Nova AI v3.8 — Galaxy Ultimate

Nova AI is a futuristic browser AI workspace with chat, research, coding, study, files, voice, image generation, projects, and visual effects.

## What changed in v3.8

- Fixed the GitHub Pages 405 problem for Cloudflare chat/image calls by adding a browser fallback when Netlify Functions are unavailable.
- Cloudflare FLUX image generation now has a direct fallback path when Cloudflare credentials are configured in Settings.
- Image quality selector now maps Standard to 4 FLUX steps and High to 8 FLUX steps instead of pretending 1K/2K/4K are native FLUX output sizes.
- Current/fresh questions in Auto mode prefer Groq GPT-OSS with browser search when a Groq key is configured; Cloudflare and OpenRouter remain fallbacks.
- Text attachments are included in model context.
- Image attachments are passed to Groq vision-capable Responses requests when a Groq key is configured.
- Mobile sidebar now opens/closes cleanly, has a backdrop, closes after navigation, and closes with Escape.
- Added animated 3D-style cyan/violet galaxy flow lines around the chat greeting.
- Added a local Nova Pro demo activation state and a non-functional scanner preview.
- Full-screen mobile sizing was improved with dynamic viewport units.

## Model routing

Auto / Best:

Fresh/current request + Groq configured → Groq GPT-OSS 120B with browser search → Cloudflare GLM 4.7 Flash → OpenRouter Free.

Normal request + Cloudflare configured → Cloudflare GLM 4.7 Flash → Groq → OpenRouter.

Manual model selection is also available.

## API configuration

For a secure Netlify deployment, set these server-side environment variables:

CF_API_TOKEN
CF_ACCOUNT_ID
GROQ_API_KEY
OPENROUTER_API_KEY

Do not commit API keys to GitHub.

For GitHub Pages testing, the Settings panel can store Cloudflare credentials locally so the new browser fallback can call Cloudflare directly. This is less secure for a public deployment; use server-side environment variables for production.

## Image generation

Primary engine: Cloudflare FLUX.1 schnell.

The included Netlify function keeps the Cloudflare token server-side. On a static GitHub Pages host, the browser fallback is used only when Cloudflare credentials have been entered in Nova Settings.

The app's own limit is 4 image generations per day. Provider limits still apply.

## Nova Pro

The ₹30/month card is a UI/demo concept in this build. The activation button only enables a local Pro state. No real payment collection or payment processing is implemented.

## Important

Nova AI can provide a ChatGPT-like user experience and model routing, but it does not contain OpenAI's private ChatGPT source code or internal proprietary systems.
