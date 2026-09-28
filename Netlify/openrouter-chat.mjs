const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
export default async request=>{
 if(request.method==='OPTIONS')return new Response('',{status:204});
 if(request.method!=='POST')return json({error:'POST required.'},405);
 const key=String(process.env.OPENROUTER_API_KEY||'').trim();if(!key)return json({error:'OpenRouter is not configured on Netlify.',code:'MISSING_ENV'},500);
 let body;try{body=await request.json()}catch{return json({error:'Invalid JSON request.'},400)}
 body.model='openrouter/free';
 const c=new AbortController(),timer=setTimeout(()=>c.abort(),45000);
 try{const r=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','X-Title':'Nova AI'},body:JSON.stringify(body),signal:c.signal});const raw=await r.text();if(!r.ok)return json({error:`OpenRouter returned HTTP ${r.status}.`,detail:raw.slice(0,1500)},r.status);let d;try{d=JSON.parse(raw)}catch{return json({error:'OpenRouter returned invalid JSON.'},502)}const text=d?.choices?.[0]?.message?.content||'';if(!text)return json({error:'OpenRouter returned no text response.'},502);return json({text,model:d?.model||'OpenRouter Free',sources:[]})}catch(e){if(e?.name==='AbortError')return json({error:'OpenRouter timed out.',code:'TIMEOUT'},504);return json({error:'Unable to reach OpenRouter.',detail:String(e?.message||e).slice(0,1000)},502)}finally{clearTimeout(timer)}};
