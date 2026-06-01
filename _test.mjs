import {JSDOM, VirtualConsole} from "jsdom";
import fs from "fs";
const html=fs.readFileSync("Treino.html","utf-8");
let pass=0,fail=0; const fails=[];
const ok=(c,m)=>{ if(c){pass++;} else {fail++; fails.push(m);} };

const vc=new VirtualConsole();
let jsErr=null;
vc.on("jsdomError",e=>{ if(!/Not implemented/.test(e.message)){ jsErr=e.message; console.log("JSDOM ERROR:",e.message);} });

const ctx=new Proxy({},{get(t,p){
  if(p==="createLinearGradient"||p==="createRadialGradient")return ()=>({addColorStop(){}});
  if(p==="measureText")return ()=>({width:10});
  if(p==="getImageData")return ()=>({data:[]});
  if(p==="canvas")return {width:300,height:150};
  return ()=>{};
}});

const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,virtualConsole:vc,url:"https://local/treino",
  beforeParse(w){
    w.scrollTo=()=>{};
    w.HTMLCanvasElement.prototype.getContext=()=>ctx;
    w.AudioContext=w.webkitAudioContext=function(){return {currentTime:0,destination:{},close(){},
      createOscillator:()=>({connect(){},start(){},stop(){},frequency:{value:0},type:""}),
      createGain:()=>({connect(){},gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}}})};};
    w.devicePixelRatio=2;
    try{Object.defineProperty(w.navigator,"vibrate",{value:()=>true,configurable:true});}catch(e){}
  }});
const {window}=dom, doc=window.document;
const LS="treino_app_v1";
const st=()=>JSON.parse(window.localStorage.getItem(LS)||"{}");
const $=s=>doc.querySelector(s), $$=s=>[...doc.querySelectorAll(s)];
const fire=(el,t)=>el.dispatchEvent(new window.Event(t,{bubbles:true}));
await new Promise(r=>setTimeout(r,80));

// --- boot ---
ok(!jsErr, "no JS errors on boot ("+jsErr+")");
ok($("#view") && $("#view").innerHTML.length>200, "Hoje view renders");
ok($$(".navbtn").length===5, "5 tabs present");
ok(typeof window.setTab==="function", "globals reachable (setTab)");

// helpers from app
const ymd=window.ymd, mondayOf=window.mondayOf, today=window.today, planKeyForDate=window.planKeyForDate, parseYmd=window.parseYmd;
const mon=ymd(mondayOf(today()));
ok(planKeyForDate(parseYmd(mon))==="A", "Monday => plan A");

// navigate to a training day (Monday) via Semana tab daycard
window.setTab("semana");
const card=$(`[data-open="${mon}"]`);
ok(!!card, "Monday daycard exists in Semana");
card.click(); // -> hoje for Monday
ok($$('[data-set="kg"]').length>0, "training day shows kg/reps set inputs");

// --- per-set logging persists ---
const kg=$('[data-set="kg"][data-i="0"][data-s="0"]'), rp=$('[data-set="reps"][data-i="0"][data-s="0"]');
kg.value="60"; fire(kg,"change"); rp.value="10"; fire(rp,"change");
const sess=st().sessions||{}; const slot=(sess[mon]||{})["A-0"];
ok(slot && slot.sets && slot.sets[0] && slot.sets[0].kg==="60" && slot.sets[0].reps==="10", "kg×reps saved to sessions");

// --- exercise substitution via data-pick ---
const beforeName=$('.ex .name').textContent;
$('[data-act="swap"][data-i="0"]').click();
const picks=$$('[data-pick]').filter(p=>p.dataset.pick && p.dataset.pick!==beforeName.replace(/🏆.*/,'').trim());
ok($$('[data-pick]').length>1, "swap sheet shows exercise database options");
picks[0].click();
const ov=(st().overrides||{}).A;
ok(ov && ov["0"] && ov["0"].nome, "substitution stored in overrides");

// --- auto-rest timer fires on toggle ---
window.setTab("semana"); $(`[data-open="${mon}"]`).click();
$('[data-act="toggle"][data-i="1"]').click();
ok((((st().log||{})[mon]||{}).done||{})["A-1"]===true, "toggling marks exercise done");
ok($("#overlay").className.includes("open"), "autoRest opened the rest timer");
window.closeSheet();
ok(!$("#overlay").className.includes("open"), "closeSheet hides overlay + stops timer");

// --- calculators ---
window.openTools();
const rmKg=$("#rmKg"), rmReps=$("#rmReps"); rmKg.value="100"; fire(rmKg,"input"); rmReps.value="5"; fire(rmReps,"input");
ok(/1RM/.test($("#rmOut").innerHTML) && /11[0-9]\.[0-9]/.test($("#rmOut").innerHTML.replace(/,/g,'.')), "1RM calc outputs estimate (~116.7)");
const plT=$("#plTotal"); plT.value="60"; fire(plT,"input");
ok($("#plOut").innerHTML.length>0, "plate calc outputs a loadout");
window.closeSheet();

// --- progress tab + PRs ---
window.setTab("progresso");
const pv=$("#view").innerHTML;
ok(/Progresso por exerc/.test(pv), "Progresso view renders");
ok(/Recordes|PR/.test(pv), "PR section present after logging");
ok(/achart/.test(pv), "adherence chart canvas present");
ok(!jsErr, "no JS errors after progress/charts ("+jsErr+")");

// --- cycle flip ---
const a0=st().anchor; $("#cycleBtn").click(); const a1=st().anchor;
ok(a0!==a1, "cycle button flips anchor (alternates C1/C2,D1/D2)");
window.closeSheet();

// --- all tabs render without error ---
for(const t of ["hoje","semana","peso","progresso","notas"]){ window.setTab(t); ok($("#view").innerHTML.length>50, "tab renders: "+t); }
ok(!jsErr, "no JS errors after visiting all tabs ("+jsErr+")");

window.stopTimer && window.stopTimer();
console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
if(fail) console.log("FAILED:\n - "+fails.join("\n - "));
dom.window.close();
process.exit(fail?1:0);
