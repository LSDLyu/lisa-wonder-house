'use strict';
const houseEnglish=document.documentElement.lang.startsWith('en');
const houseNames=[['小桃一家','The Peach Family'],['小熊旅行团','Teddy Travel Club'],['小云姐姐','Cloud'],['乐乐一家','The Happy Family'],['小树先生','Mr. Oak'],['Lisa 和朋友们','Lisa and friends'],['生日快乐！','Happy birthday!'],['花开婚礼','Garden Wedding']];
function houseSavedText(value){const pair=houseNames.find(p=>p.includes(value));return pair?pair[houseEnglish?1:0]:value;}
// Both languages share the same origin-wide save key. Local and GitHub Pages
// builds use sibling language folders; edu routes use their public counterparts.
document.addEventListener('DOMContentLoaded',()=>{
 const edu=location.pathname.includes('/games/lisa-wonder-house');
 const link=document.querySelector('#languageLink');
 link.href=edu?(houseEnglish?'/games/lisa-wonder-house/':'/en/games/lisa-wonder-house/'):(houseEnglish?'../zh/':'../en/');
 link.textContent=houseEnglish?'中文':'English';
 link.lang=houseEnglish?'zh-CN':'en';
 link.setAttribute('aria-label',houseEnglish?'Switch to Chinese':'Switch to English');
 const directory=document.querySelector('#directoryLink');
 if(edu){directory.href=houseEnglish?'/en/games/':'/games/';directory.hidden=false;}
});
