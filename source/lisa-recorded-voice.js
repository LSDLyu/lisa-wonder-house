'use strict';
(() => {
 const normalize = text => String(text).replace(/[\s，。！、·,.!?？]/g, '');
 const recordings = new Map(Object.entries({
  "超惊险滑梯，到了": "04_arrive_slide.mp3",
  "会议室，到了": "05_arrive_meeting.mp3",
  "棋牌与婚礼，到了": "06_arrive_wedding.mp3",
  "生日庆祝区，到了": "07_arrive_birthday.mp3",
  "失物招领区，到了": "08_arrive_lost.mp3",
  "接待大厅，到了": "09_arrive_lobby.mp3",
  "海洋球与游泳池，到了": "10_arrive_pool.mp3",
  "温泉 · 餐厅 · 健身房，到了": "11_arrive_spa.mp3",
  "停车场，到了": "12_arrive_parking.mp3",
  "下雨天会撑开的小伞": "13_clue_umbrella.mp3",
  "软软的，可以抱着睡觉的小熊": "14_clue_bear.mp3",
  "踢起来会滚动的足球": "15_clue_football.mp3",
  "宝贝都找到主人啦！": "16_complete_lost.mp3",
  "你记得每一张笑脸！": "17_complete_memory.mp3",
  "留住幸福的一刻！": "18_complete_wedding.mp3",
  "大家都准备好啦，小主持人！": "19_complete_meeting.mp3",
  "三件小宝藏都找到啦！": "20_complete_balls.mp3",
  "小鸭子们排好队啦！": "21_complete_pool.mp3",
  "暖暖的，整个人都放松啦！": "22_complete_spa.mp3",
  "谢谢你，这一餐真好吃！": "23_complete_food.mp3",
  "运动完成，活力满满！": "24_complete_gym.mp3",
  "停车完成，去楼上玩吧！": "25_complete_parking.mp3",
  "许好愿啦，生日纪念照也存进纪念册了！": "26_complete_birthday.mp3",
  "欢迎入住": "27_welcome_checkin.mp3",
  "来看看客人的愿望吧": "28_guest_wishes.mp3"
}).map(([text,file])=>[normalize(text),file]));
 let current = null, epoch = 0;
 function stop() {
  epoch++;
  const old=current; current=null;
  if(old) { old.onended=null; old.onerror=null; try { old.pause(); old.currentTime=0; } catch {} }
 }
 function play(text, {language='zh-CN', volume=1, allowed=()=>true, fallback=()=>{}}={}) {
  stop();
  const file=recordings.get(normalize(text));
  if(!/^zh\b/i.test(language)||!file||!allowed())return false;
  const generation=epoch;
  let failed=false;
  const fail=()=>{if(failed||generation!==epoch)return;failed=true;stop();if(allowed())fallback();};
  try {
   const audio=new Audio('assets/lisa-voice-20261117/'+file);
   current=audio; audio.preload='none'; audio.volume=Math.max(0,Math.min(1,volume));
   audio.onended=()=>{if(generation===epoch)current=null;};
   audio.onerror=fail;
   const pending=audio.play();if(pending?.catch)pending.catch(fail);
  } catch {fail();}
  return true;
 }
 window.LisaRecordedVoice=Object.freeze({play,stop});
})();
