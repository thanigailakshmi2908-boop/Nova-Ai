const json = (data, status=200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
});

const imageResponse = (bytes, contentType) => new Response(bytes, {
  status: 200,
  headers: {
    'Content-Type': contentType || 'image/jpeg',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
});

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response('', { status: 204 });
  if (request.method !== 'POST') return json({ error: 'POST required.' }, 405);

  const token = String(process.env.CF_API_TOKEN || '').trim();
  const accountId = String(process.env.CF_ACCOUNT_ID || '').trim();
  if (!token || !accountId) {
    return json({
      error: 'Cloudflare image service is not configured on Netlify.',
      code: 'MISSING_ENV',
      setup: 'Add CF_API_TOKEN and CF_ACCOUNT_ID to Netlify Environment Variables, then redeploy the site.'
    }, 500);
  }

  let body;
  try { body = await request.json(); }
  catch { return json({ error: 'Invalid JSON request.', code: 'BAD_JSON' }, 400); }

  const prompt = String(body?.prompt || '').trim().slice(0, 2048);
  if (!prompt) return json({ error: 'Image prompt is required.', code: 'EMPTY_PROMPT' }, 400);

  const model = '@cf/black-forest-labs/flux-1-schnell';
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${encodeURIComponent(model).replace(/%2F/g,'/')}`;
  const payload = {
    prompt,
    steps: Math.min(8, Math.max(1, Number(body?.steps) || 4)),
    seed: Number.isFinite(Number(body?.seed)) ? Number(body.seed) : Math.floor(Math.random() * 2147483647)
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 70000);
  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json, image/*'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const contentType = (upstream.headers.get('content-type') || '').toLowerCase();
    if (!upstream.ok) {
      const raw = await upstream.text();
      let detail = raw;
      try {
        const parsed = JSON.parse(raw);
        detail = parsed?.errors?.map?.(x => x.message).filter(Boolean).join('; ') || parsed?.error?.message || parsed?.message || raw;
      } catch {}
      return json({
        error: `Cloudflare returned HTTP ${upstream.status}.`,
        code: upstream.status === 401 || upstream.status === 403 ? 'AUTH' : upstream.status === 429 ? 'RATE_LIMIT' : 'CLOUDFLARE_ERROR',
        detail: String(detail).slice(0, 1500)
      }, upstream.status);
    }

    if (contentType.startsWith('image/')) {
      return imageResponse(await upstream.arrayBuffer(), contentType);
    }

    const data = await upstream.json();
    const rawImage = data?.result?.image ?? data?.result?.image_b64 ?? data?.image ?? data?.result?.data ?? '';
    if (typeof rawImage !== 'string' || !rawImage) {
      return json({ error: 'Cloudflare completed the request but returned no image data.', code: 'NO_IMAGE' }, 502);
    }
    const dataURI = rawImage.startsWith('data:') ? rawImage : `data:image/jpeg;base64,${rawImage}`;
    return json({ dataURI, model });
  } catch (error) {
    if (error?.name === 'AbortError') return json({ error: 'Cloudflare image generation timed out. Try a shorter prompt.', code: 'TIMEOUT' }, 504);
    return json({ error: 'Netlify could not reach Cloudflare.', code: 'UPSTREAM_NETWORK', detail: String(error?.message || error).slice(0, 1000) }, 502);
  } finally {
    clearTimeout(timer);
  }
};
