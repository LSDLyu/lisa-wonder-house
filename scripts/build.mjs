import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'source');
const translations = (await readFile(path.join(source,'en.tsv'),'utf8')).trimEnd().split('\n').map(line => {const i=line.indexOf('\t'); if(i<0)throw Error(`Invalid translation: ${line}`); return [line.slice(0,i),line.slice(i+1)];}).sort((a,b)=>b[0].length-a[0].length);
const lookup = new Map(translations);
const pattern = new RegExp(translations.map(([s])=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
const translate = value => value.replace(pattern, s=>lookup.get(s));
await rm(path.join(root,'dist'), {recursive:true,force:true});
for (const lang of ['zh','en']) {
 const out=path.join(root,'dist',lang); await mkdir(out,{recursive:true});
 await cp(path.join(source,'assets'),path.join(out,'assets'),{recursive:true});
 for(const name of ['index.html','site-audio.mjs','game-shell.js','game.js','upgrade.js','style.css','upgrade.css','locale.js']) {
  let value=await readFile(path.join(source,name),'utf8');
  if(lang==='en'&&['index.html','game.js','upgrade.js'].includes(name)) {
   value=translate(value).replaceAll('zh-CN','en-US');
   for(const [from,to] of [
    ['Lisa Wonder House','Lisa’s Wonder House'],
    ['Young designer Lisa interactive dollhouse','An interactive dollhouse designed by Lisa'],
    ['Explore  Lisa  designed this wonder house.','Explore Lisa’s wonder house.'],
    ['By  Lisa Design','Designed by Lisa'],
    ['${f.id}F ${f.title}',"${f.id}${f.id.startsWith('B')?'':'F'} ${f.title}"],
    ['${f.id}F${f.title}',"${f.id}${f.id.startsWith('B')?'':'F'} ${f.title}"],
    ['${g.room}  room','room ${g.room}'],
    ['Collect star ${i+1} stars','Collect star ${i+1}'],
    ['near Lisa .','near Lisa.'],
    ['Go to ${floors[index].id} F',"Go to ${floors[index].id}${floors[index].id.startsWith('B')?'':'F'}"],
    ["`${state.selectedRoom||'Lisa'}  room`","`Room ${state.selectedRoom||'Lisa'}`"],
    ['`${state.selectedRoom||701}  room`','`Room ${state.selectedRoom||701}`'],
    ['${r}  room','Room ${r}'],
    ['${id}  room','Room ${id}'],
    ['${state.upperFloor} F rooms','${state.upperFloor}F rooms'],
    ['7 F rooms','7F rooms'],
    ['${Math.floor(Number(state.selectedRoom||701)/100)} F','${Math.floor(Number(state.selectedRoom||701)/100)}F'],
    ['${state.upperFloor} F','${state.upperFloor}F'],
    ['${floors[state.floor].id} F','${floors[state.floor].id}'],
    ['${g.name} would like to try ${activities[g.wish][0]}','${g.name}: ${activities[g.wish][0]}'],
    ['“','“'],['，',', '],['。','.'],['：',': '],['、',', '],['！','!'],['？','?']
   ]) value=value.split(from).join(to);
   value=value.replace(/Lisa\s+Wonder House/g,'Lisa’s Wonder House').replace(/Young designer\s+Lisa\s+interactive dollhouse/g,'An interactive dollhouse designed by Lisa').replace(/By\s+Lisa\s+Design/g,'Designed by Lisa').replace(/Explore\s+Lisa\s+designed this wonder house\./g,'Explore Lisa’s wonder house.').replaceAll('${g.room} .','${g.room}.');
   if(/[\u3400-\u9fff]/u.test(value))throw Error(`Untranslated text in ${name}: ${value.match(/.{0,25}[\u3400-\u9fff].{0,35}/u)?.[0]}`);
  }
  if(name==='index.html') {
   const zh='https://edu.alading.org/games/lisa-wonder-house/',en='https://edu.alading.org/en/games/lisa-wonder-house/';
   value=value.replace('</head>',`<link rel="canonical" href="${lang==='en'?en:zh}"><link rel="alternate" hreflang="zh-CN" href="${zh}"><link rel="alternate" hreflang="en" href="${en}"></head>`);
  }
  await writeFile(path.join(out,name),value);
 }
}
await writeFile(path.join(root,'dist/index.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><title>Lisa’s Wonder House</title><meta http-equiv="refresh" content="0;url=zh/"><a href="zh/">中文</a> · <a href="en/">English</a></html>');
console.log('Built Chinese and English editions. All game text translated.');
