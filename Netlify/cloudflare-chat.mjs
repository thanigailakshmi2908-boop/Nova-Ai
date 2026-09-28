const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
export default async request=>{
 if(request.method==='OPTIONS')return new Response('',{status:204});
 if(request.method!=='POST')return json({error:'POST required.'},405);
 const token=String(process.env.CF_API_TOKEN||'').trim(),accountId=String(process.env.CF_ACCOUNT_ID||'').trim();
 if(!token||!accountId)return json({error:'Cloudflare chat service is not configured.',code:'MISSING_ENV'},500);
 let body;try{body=await request.json()}catch{return json({error:'Invalid JSON request.'},400)}
 const endpoint=`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/@cf/zai-org/glm-4.7-flash`;
 const c=new AbortController(),timer=setTimeout(()=>c.abort(),45000);
 try{const r=await fetch(endpoint,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(body),signal:c.signal});const raw=await r.text();if(!r.ok)return json({error:`Cloudflare returned HTTP ${r.status}.`,detail:raw.slice(0,1500)},r.status);let d;try{d=JSON.parse(raw)}catch{return json({error:'Cloudflare returned invalid JSON.'},502)}const text=d?.result?.response||d?.result?.choices?.[0]?.message?.content||d?.result?.output_text||d?.output_text||'';if(!text)return json({error:'Cloudflare returned no text response.'},502);return json({text,model:'GLM 4.7 Flash · Cloudflare',sources:[]})}catch(e){if(e?.name==='AbortError')return json({error:'Cloudflare chat timed out.',code:'TIMEOUT'},504);return json({error:'Unable to reach Cloudflare.',detail:String(e?.message||e).slice(0,1000)},502)}finally{clearTimeout(timer)}};
