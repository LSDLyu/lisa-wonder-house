import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const read=p=>readFile(new URL('../'+p,import.meta.url));
const source=await read('source/lisa-recorded-voice.js');
const rows=JSON.parse(await read('recordings-20261117.json'));
function harness(){
 const instances=[];let fallback=0,allowed=true;
 class Audio {constructor(src){this.src=src;instances.push(this);}play(){return {catch:fn=>{this.reject=fn;}};}pause(){this.paused=true;}}
 const context={window:{},Audio};vm.runInNewContext(source.toString(),context);
 return {voice:context.window.LisaRecordedVoice,instances,options:{allowed:()=>allowed,fallback:()=>fallback++,volume:.4},get fallback(){return fallback;},mute(){allowed=false;}};
}
test('all 25 approved files match manifest and map to the expected scene in both builds',async()=>{
 assert.equal(rows.length,25);
 const h=harness();
 for(const row of rows){
  for(const prefix of ['source','dist/zh','dist/en']){
   const bytes=await read(prefix+'/assets/lisa-voice-20261117/'+row.file);
   assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256);
  }
  assert.equal(h.voice.play(row.text,h.options),true);
  assert.equal(h.instances.at(-1).src,'assets/lisa-voice-20261117/'+row.file);
  assert.equal(h.instances.at(-1).volume,.4);
 }
});
test('English, unknown prompts, and disabled voice do not start a recording',()=>{
 const h=harness();
 assert.equal(h.voice.play(rows[0].text,{...h.options,language:'en-US'}),false);
 assert.equal(h.voice.play('unrecorded',h.options),false);
 h.mute();assert.equal(h.voice.play(rows[0].text,h.options),false);
 assert.equal(h.instances.length,0);
});
test('new speech and scene stop cancel old audio and stale error callbacks',()=>{
 const h=harness();h.voice.play(rows[0].text,h.options);const a=h.instances[0],error=a.onerror;
 h.voice.play(rows[1].text,h.options);assert.equal(a.paused,true);error();a.reject();
 assert.equal(h.fallback,0);const b=h.instances[1];h.voice.stop();assert.equal(b.paused,true);b.reject();assert.equal(h.fallback,0);
});
test('failed playback falls back once, but never after mute',()=>{
 const h=harness();h.voice.play(rows[0].text,h.options);const a=h.instances[0],error=a.onerror;
 error();a.reject();assert.equal(h.fallback,1);
 h.voice.play(rows[1].text,h.options);h.mute();h.instances[1].reject();assert.equal(h.fallback,1);
});
test('scene hooks preserve separate check-in and guest-wish prompts and shared sound controls',async()=>{
 const game=(await read('source/game.js')).toString(),upgrade=(await read('source/upgrade.js')).toString();
 assert.match(game,/speak\(document.documentElement.lang.startsWith\('zh'\)\?'欢迎入住'/);
 assert.match(game,/g.stage==='checkedin'\)\{\s+if\(document.documentElement.lang.startsWith\('zh'\)\)speak\('来看看客人的愿望吧'\)/);
 assert.match(upgrade,/function stopSounds\(\)\{window.LisaRecordedVoice\?\.stop\(\)/);
 assert.match(upgrade,/state.sound&&state.voice&&siteSoundAllowed\('voice'\)&&!document.hidden/);
 assert.match(upgrade,/cleanup=function\(\)\{oldCleanup\(\);stopSounds\(\)/);
 assert.match(upgrade,/document.hidden\)\{stopSounds\(\)/);
 assert.match(upgrade,/zide-audio-change',\(\)=>\{stopSounds\(\)/);
});
