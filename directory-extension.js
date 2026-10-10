// Append once to a fresh export of lisa-games-router. Existing handlers stay intact.
const beforeWonderHouseFetch = lisa_games_router_default.fetch;
lisa_games_router_default.fetch = async function(request, env, ctx) {
 const path=new URL(request.url).pathname;
 const response=await beforeWonderHouseFetch.call(this,request,env,ctx);
 if(!['/games','/games/','/en/games','/en/games/'].includes(path)||request.method!=='GET'||response.status!==200||!(response.headers.get('content-type')||'').includes('text/html'))return response;
 const html=await response.text();
 if(html.includes('class="card wonder-house-card"'))return new Response(html,response);
 const english=path.startsWith('/en/');
 const card=english?
 '<a class="card wonder-house-card" href="/en/games/lisa-wonder-house/"><div class="card-top" style="background:#e5d4f5"><span>05</span><span>STORIES · CREATIVE PLAY</span></div><div class="card-body"><p class="tag">13 activities · A six-floor slide</p><h2>Lisa’s Wonder House</h2><p class="desc">Welcome guests, host a birthday party, decorate rooms and collect stars on a slide through the whole house. Make your own stories with gentle sounds.</p><span class="button play">Explore the house →</span></div></a>':
 '<a class="card wonder-house-card" href="/games/lisa-wonder-house/"><div class="card-top" style="background:#e5d4f5"><span>05</span><span>故事 · 自由探索</span></div><div class="card-body"><p class="tag">13 种活动 · 六层全景滑梯</p><h2>Lisa 的奇妙大楼</h2><p class="desc">接待客人、举办生日派对、布置客房，乘坐贯穿整栋楼的滑梯收集星星。伴着轻柔音效，创造自己的小故事。</p><span class="button play">进入奇妙大楼 →</span></div></a>';
 if(!html.includes('    </section>'))throw Error('Game directory insertion marker missing');
 const headers=new Headers(response.headers);for(const key of ['content-length','content-encoding','etag'])headers.delete(key);headers.set('Cache-Control','no-cache');
 return new Response(html.replace('    </section>',card+'\n    </section>'),{status:200,headers});
};
