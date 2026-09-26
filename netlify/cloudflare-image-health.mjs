export default async (request) => {
  if (request.method === 'OPTIONS') return new Response('', {status:204});
  const token = !!String(process.env.CF_API_TOKEN || '').trim();
  const accountId = !!String(process.env.CF_ACCOUNT_ID || '').trim();
  return new Response(JSON.stringify({ok: token && accountId, cloudflareTokenConfigured: token, accountIdConfigured: accountId}), {
    status: 200,
    headers: {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'}
  });
};
