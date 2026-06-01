"use strict";
// ---- stubs (only pure-logic fns are executed; DOM fns just syntax-checked) ----
function lastWeight(){return 75;}
function esc(s){return String(s==null?"":s).replace(/"/g,"&quot;");}
function ymd(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function parseYmd(s){const p=s.split("-");return new Date(+p[0],+p[1]-1,+p[2]);}
function mondayOf(d){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());const wd=(x.getDay()+6)%7;x.setDate(x.getDate()-wd);return x;}
function addDays(d,n){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()+n);return x;}
function today(){return new Date(2026,5,1);}
const WD_NAMES=["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const MES=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const PLANS={A:{foco:"Costas, bíceps"},C1:{foco:"Pernas completas",rest:false},REC:{foco:"x",rest:true}};
let state={activities:[],diet:null};
function planKeyForDate(){return "C1";}function dayTotal(){return 6;}function countDone(){return 2;}
function dietS(){return {targets:{kcal:0}};}function dietConsumed(){return {kcal:0,p:0,c:0,f:0};}function dietDay(){return {water:0};}
function fmtWater(ml){ml=Math.round(ml||0);if(ml>=1000){const l=ml/1000;return (Number.isInteger(l)?l:l.toFixed(1)).toString().replace(".",",")+" L";}return ml+" ml";}
function openSheet(){}function closeSheet(){}function render(){}function save(){}function beep(){}
const navigator={};const document={getElementById:()=>null,querySelectorAll:()=>[]};

/* ===== PASTE OF NEW v4 BLOCK ===== */
function dashCard(){const k=ymd(today()),tipo=planKeyForDate(today()),tot=dayTotal(tipo),dn=countDone(k,tipo);
  const con=dietConsumed(k),tg=dietS().targets,day=dietDay(k);
  const acts=(state.activities||[]).filter(a=>a.date===k),amin=acts.reduce((s,a)=>s+(+a.dur||0),0);
  const treinoTxt=PLANS[tipo].rest?"Descanso":`${dn}/${tot}`;
  return `<div class="dash"><div class="dcell" data-go="hoje"><div class="dv">${treinoTxt}</div></div></div>`;}
function warmupCard(tipo){return `<div class="card">${warmupFor(tipo)}</div>`;}
function warmupFor(tipo){const f=(PLANS[tipo].foco||"").toLowerCase();
  if(/perna|quadr|posterior|gl[úu]teo|panturr/.test(f))return "5 min de bike/esteira + 1 série leve.";
  if(/peito|ombro|tr[íi]ceps/.test(f))return "Mobilidade de ombros.";
  if(/costa|b[íi]ceps/.test(f))return "Mobilidade de escápulas.";
  return "5 min de cardio leve.";}
const ACTS=[
 ["Corrida","🏃",9.8,1],["Caminhada","🚶",3.8,1],["Ciclismo","🚴",7.5,2],["Natação","🏊",7.0,0],
 ["Futebol","⚽",7.0,0],["Futsal","🥅",8.0,0],["Futvôlei","🏐",5.5,0],["Vôlei","🏐",4.0,0],
 ["Basquete","🏀",6.5,0],["Boxe","🥊",9.0,0],["Muay Thai","🥋",10.0,0],["Luta / Jiu-jitsu","🤼",10.0,0],
 ["Pular corda","🪢",11.0,0],["Funcional / HIIT","🔥",8.0,0],["Tênis","🎾",7.3,0],["Outro","✨",6.0,0]
];
function actMeta(name){return ACTS.find(a=>a[0]===name)||["Outro","✨",6.0,0];}
function actKcal(name,min,intensity){const met=actMeta(name)[2]*(intensity==="leve"?0.85:intensity==="intenso"?1.15:1),w=parseFloat(lastWeight())||75;return Math.round(met*w*(min/60));}
function fmtPace(min,km){if(!(min>0&&km>0))return "";const p=min/km,m=Math.floor(p),s=Math.round((p-m)*60);return (s===60?(m+1)+":00":m+":"+String(s).padStart(2,"0"))+" /km";}
function fmtSpeed(min,km){if(!(min>0&&km>0))return "";return (km/(min/60)).toFixed(1).replace(".",",")+" km/h";}
function actDetail(a){const dm=actMeta(a.type)[3],parts=[];if(a.dur)parts.push(a.dur+" min");
  if(a.dist>0){parts.push((+a.dist).toString().replace(".",",")+" km");if(dm===1)parts.push(fmtPace(a.dur,a.dist));else if(dm===2)parts.push(fmtSpeed(a.dur,a.dist));}
  if(a.intensity&&a.intensity!=="moderado")parts.push(a.intensity);return parts.join(" · ");}
const STRETCHES=[
 ["Pescoço lateral","Pescoço",30,"x"],["Ombros","Ombros",30,"x"],["Tríceps","Braços",30,"x"],["Peito","Peito",30,"x"],
 ["Gato–camelo","Coluna",40,"x"],["Rotação","Coluna",30,"x"],["Borboleta","Quadril",40,"x"],["Posterior","Posterior de Coxa",30,"x"],
 ["Quadríceps","Quadríceps",30,"x"],["Panturrilha","Panturrilha",30,"x"],["Glúteo","Glúteo",40,"x"],["Joelhos ao peito","Lombar",30,"x"],
 ["Flexor","Quadril",30,"x"],["Criança","Coluna",40,"x"]
];
const ROT_CURTA=[4,7,8,9,11,13];
const ROT_COMPLETA=STRETCHES.map((_,i)=>i);

// ---- assertions ----
let f=0;const ok=(c,m)=>{if(!c){f++;console.log("FAIL:",m);}};
ok(actKcal("Corrida",60,"moderado")===735,"actKcal corrida 60min@75kg=735 (got "+actKcal("Corrida",60,"moderado")+")");
ok(actKcal("Corrida",60,"intenso")===Math.round(9.8*1.15*75),"actKcal intensidade ajusta MET");
ok(fmtPace(30,5)==="6:00 /km","pace 30min/5km=6:00 (got "+fmtPace(30,5)+")");
ok(fmtPace(25,5)==="5:00 /km","pace 25/5=5:00");
ok(fmtSpeed(30,10)==="20,0 km/h","speed 10km/30min=20 (got "+fmtSpeed(30,10)+")");
ok(actDetail({type:"Corrida",dur:45,dist:9,intensity:"moderado"})==="45 min · 9 km · 5:00 /km","actDetail corrida (got "+actDetail({type:"Corrida",dur:45,dist:9,intensity:"moderado"})+")");
ok(actDetail({type:"Futsal",dur:60,dist:0,intensity:"intenso"})==="60 min · intenso","actDetail esporte sem distância");
ok(ROT_CURTA.every(i=>i<STRETCHES.length)&&ROT_COMPLETA.length===STRETCHES.length,"rotinas com índices válidos");
ok(STRETCHES.every(s=>s.length===4&&s[2]>0),"STRETCHES bem formados");
ok(actMeta("Muay Thai")[1]==="🥋","actMeta acha por nome");
ok(typeof dashCard==="function"&&typeof warmupCard==="function","dashCard/warmupCard definidos");
console.log(f?("VLOGIC_FAIL "+f):"VLOGIC_OK");
