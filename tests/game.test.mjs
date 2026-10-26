import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import vm from 'node:vm';
import worker from '../worker.js';
const read=(file)=>readFile(new URL('../'+file,import.meta.url),'utf8');
test('both editions parse and contain all 13 activities with complete English text',async()=>{
 for(const lang of ['zh','en']){
  const code=await read(`dist/${lang}/game.js`), upgrade=await read(`dist/${lang}/upgrade.js`);
  new vm.Script(code);new vm.Script(upgrade);new vm.Script(await read(`dist/${lang}/locale.js`));
  const activities=code.match(/const activities=(.*);\n/)[1];
  assert.equal(Object.keys(vm.runInNewContext('('+activities+')')).length,13);
  if(lang==='en')for(const file of ['index.html','game.js','upgrade.js'])assert.doesNotMatch(await read(`dist/en/${file}`),/[\u3400-\u9fff]/u);
  assert.match(code,/lisa-house-v1/); assert.match(upgrade,/u.lang='(?:zh-CN|en-US)'/);
 }
});
test('localized routes, assets, canonical redirects and unknown files',async()=>{
 const seen=[];const env={ASSETS:{fetch:async req=>{seen.push(new URL(req.url).pathname);return new Response('ok');}}};
 for(const [prefix,lang] of [['','zh'],['/en','en']]){
  const base=`https://edu.alading.org${prefix}/games/lisa-wonder-house`;
  const redirect=await worker.fetch(new Request(base+'?demo=1'),env);assert.equal(redirect.status,308);assert.equal(redirect.headers.get('location'),base+'/?demo=1');
  for(const [suffix,file] of [['','index.html'],['game.js','game.js'],['game-shell.js','game-shell.js'],['assets/lisa.png','assets/lisa.png']]){
   const response=await worker.fetch(new Request(base+'/'+suffix),env);assert.equal(response.status,200);assert.equal(seen.at(-1),`/${lang}/${file}`);
  }
  assert.equal((await worker.fetch(new Request(base+'/source/en.tsv'),env)).status,404);
 }
 assert.equal((await worker.fetch(new Request('https://edu.alading.org/games/typewriter/'),env)).status,404);
});
test('existing guest and memory names localize in both directions',async()=>{
 const code=await read('source/locale.js');
 for(const english of [false,true]){
  const context=vm.createContext({document:{documentElement:{lang:english?'en-US':'zh-CN'},addEventListener(){}}});
  vm.runInContext(code,context);
  assert.equal(vm.runInContext("houseSavedText('小桃一家')",context),english?'The Peach Family':'小桃一家');
  assert.equal(vm.runInContext("houseSavedText('Happy birthday!')",context),english?'Happy birthday!':'生日快乐！');
 }
});

test('every built page, script and image is reachable through the production Worker',async()=>{
 const env={ASSETS:{fetch:async request=>{
  const url=new URL(request.url);
  try{return new Response(await readFile(new URL('../dist'+url.pathname,import.meta.url)))}
  catch{return new Response('Not found',{status:404})}
 }}};
 for(const [prefix,lang] of [['','zh'],['/en','en']]){
  const root=new URL(`../dist/${lang}/`,import.meta.url);
  const files=await readdir(root,{recursive:true,withFileTypes:true});
  for(const file of files.filter(entry=>entry.isFile())){
   const suffix=file.parentPath.endsWith('/assets')?'assets/'+file.name:file.name;
   const response=await worker.fetch(new Request(`https://edu.alading.org${prefix}/games/lisa-wonder-house/${suffix}?v=route-test`),env);
   assert.equal(response.status,200,`${lang}/${suffix}`);
   assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile(new URL(suffix,root)));
  }
  for(const suffix of ['assets/house-compact.png','assets/unknown.webp','source/en.tsv']){
   assert.equal((await worker.fetch(new Request(`https://edu.alading.org${prefix}/games/lisa-wonder-house/${suffix}`),env)).status,404);
  }
 }
});
