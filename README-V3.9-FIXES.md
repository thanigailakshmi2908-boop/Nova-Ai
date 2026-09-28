Nova AI v3.9 deployment and reliability notes

The frontend can remain on GitHub Pages, but GitHub Pages is static hosting and does not execute Netlify Functions. The included serverless functions are therefore used for secure Cloudflare image/chat proxying.

For GitHub Pages + Netlify Functions:
1. Deploy this same repository to Netlify.
2. Keep the Functions directory as `netlify/functions`.
3. Add `CF_API_TOKEN` and `CF_ACCOUNT_ID` as Netlify environment variables with Functions runtime scope.
4. Optionally add `GROQ_API_KEY` and `OPENROUTER_API_KEY` if the corresponding server-side fallbacks are desired.
5. Redeploy Netlify.
6. In Nova AI Settings on the GitHub Pages app, set Serverless Proxy URL to the Netlify site URL, for example `https://your-site.netlify.app`.

This build does not place provider secrets in the repository. Do not paste API tokens into GitHub or share them in chat.

Image generation uses Cloudflare FLUX.1 schnell. The model accepts prompts up to 2048 characters and supports up to 8 diffusion steps; the app uses 4 for Standard and 8 for High quality.

Nova Pro remains a local demo activation. It does not collect or process real payments or UPI transactions.
