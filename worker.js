const bases = ['/games/lisa-wonder-house', '/en/games/lisa-wonder-house'];
export default {
 async fetch(request, env) {
  const url = new URL(request.url);
  const base=bases.find(b=>url.pathname===b||url.pathname.startsWith(b+'/'));
  if(!base)return new Response('Not found',{status:404});
  if(url.pathname===base){url.pathname+='/';return Response.redirect(url.toString(),308);}
  const suffix=url.pathname.slice(base.length+1);
  // Only the public, build-generated game files can be served.
  if(suffix && !/^(?:index\.html|(?:game|game-shell|upgrade|locale)\.js|(?:style|upgrade)\.css|assets\/(?:house|lisa|rooms)\.png)$/.test(suffix))return new Response('Not found',{status:404});
  url.pathname=(base.startsWith('/en/')?'/en/':'/zh/')+(suffix||'index.html');
  const response=await env.ASSETS.fetch(new Request(url,request));
  const headers=new Headers(response.headers);
  headers.set('X-Content-Type-Options','nosniff');
  headers.set('Referrer-Policy','strict-origin-when-cross-origin');
  headers.set('Cache-Control',suffix.startsWith('assets/')?'public, max-age=86400':'no-cache');
  return new Response(response.body,{status:response.status,headers});
 }
};
