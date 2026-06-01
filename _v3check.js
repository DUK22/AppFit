"use strict";
// stubs so node --check + a light run works in isolation
let state={diet:null,weights:[],measures:[],photos:[],settings:{}};
const DEFAULT_DIET={targets:{kcal:0,p:0,c:0,f:0,water:0},meals:[{nome:"Café da manhã",itens:[]},{nome:"Almoço",itens:[]},{nome:"Lanche da tarde",itens:[]},{nome:"Jantar",itens:[]}],customFoods:[],log:{}};
function clone(o){return JSON.parse(JSON.stringify(o));}
function ymd(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function parseYmd(s){const p=s.split("-");return new Date(+p[0],+p[1]-1,+p[2]);}
function today(){const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate());}
function save(){}
function esc(s){return String(s==null?"":s).replace(/"/g,"&quot;");}
function openSheet(){}function closeSheet(){}function render(){}function lineChart(){}
function alert(){}function confirm(){return true;}
const WD_NAMES=["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const MES=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const MESL=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const document={getElementById:()=>null,querySelectorAll:()=>[],createElement:()=>({getContext:()=>({drawImage(){}}),toDataURL:()=>"d"})};
const window={};const navigator={};const localStorage={setItem(){},getItem(){return null;}};
const LS_KEY="x";const Image=function(){};

/* ===== SESSÃO / PROGRESSÃO ===== */
let sessInt=null;
function progInc(g){return /Quadríceps|Posterior de Coxa|Glúteo|Panturrilha|Costas/.test(g)?5:2.5;}
function sessElapsedStr(start,end){let s=Math.max(0,Math.floor(((end||Date.now())-start)/1000));const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60),x=s%60;return (h>0?h+":"+String(m).padStart(2,"0"):""+m)+":"+String(x).padStart(2,"0");}
function mountSessionClock(){const el=document.getElementById("sessChip");if(!el)return;const start=+el.dataset.start,end=+el.dataset.end;if(end||!start)return;
  if(sessInt)clearInterval(sessInt);sessInt=setInterval(()=>{const e=document.getElementById("sessChip");if(!e){if(sessInt)clearInterval(sessInt);sessInt=null;return;}e.lastChild.textContent=sessElapsedStr(start,0);},1000);}

/* ===== DIETA ===== */
const FOODDB=[
 ["Frango grelhado (peito)","Proteína",165,31,0,3.6,120],["Ovo inteiro","Proteína",143,13,1.1,9.5,50],
 ["Arroz branco cozido","Carboidrato",130,2.7,28,0.3,150],["Banana","Fruta",89,1.1,23,0.3,100]
].map(a=>({nome:a[0],cat:a[1],kcal:a[2],p:a[3],c:a[4],f:a[5],base:a[6]||100}));
const FOOD_CATS=["Proteína","Carboidrato","Fruta","Laticínio","Gordura","Vegetal","Outro"];
function dietS(){if(!state.diet)state.diet=clone(DEFAULT_DIET);return state.diet;}
function allFoods(){return dietS().customFoods.concat(FOODDB);}
function itemMacros(it){const g=(+it.g||0)/100;return {kcal:it.kcal*g,p:it.p*g,c:it.c*g,f:it.f*g};}
function mealTotals(meal){let t={kcal:0,p:0,c:0,f:0};(meal.itens||[]).forEach(it=>{const m=itemMacros(it);t.kcal+=m.kcal;t.p+=m.p;t.c+=m.c;t.f+=m.f;});return t;}
function dietDay(k){const d=dietS();d.log[k]=d.log[k]||{done:{},water:0};const e=d.log[k];e.done=e.done||{};if(typeof e.water!=="number")e.water=0;return e;}
function dietConsumed(k){const d=dietS(),day=dietDay(k);let t={kcal:0,p:0,c:0,f:0};
  d.meals.forEach(meal=>(meal.itens||[]).forEach(it=>{if(day.done[it.id]){const m=itemMacros(it);t.kcal+=m.kcal;t.p+=m.p;t.c+=m.c;t.f+=m.f;}}));return t;}
function fmtWater(ml){ml=Math.round(ml||0);if(ml>=1000){const l=ml/1000;return (Number.isInteger(l)?l:l.toFixed(1)).toString().replace(".",",")+" L";}return ml+" ml";}
function lastWeight(){const ws=[...state.weights].sort((a,b)=>a.date<b.date?-1:1);return ws.length?ws[ws.length-1].kg:"";}

// ---- pure-logic assertions ----
let fails=0;function ok(c,m){if(!c){fails++;console.log("FAIL:",m);}}
// itemMacros: 200g of arroz (130kcal/100g) = 260 kcal
ok(Math.round(itemMacros({kcal:130,p:2.7,c:28,f:0.3,g:200}).kcal)===260,"itemMacros scales by grams");
// dietConsumed sums only eaten
const d=dietS();d.meals[0].itens=[{id:"a",nome:"x",kcal:100,p:10,c:0,f:0,g:100},{id:"b",nome:"y",kcal:200,p:0,c:50,f:0,g:100}];
const day=dietDay(ymd(today()));day.done["a"]=true;
const con=dietConsumed(ymd(today()));
ok(Math.round(con.kcal)===100 && Math.round(con.p)===10,"dietConsumed counts only checked items");
day.done["b"]=true;const con2=dietConsumed(ymd(today()));ok(Math.round(con2.kcal)===300,"dietConsumed adds second item");
// fmtWater
ok(fmtWater(250)==="250 ml" && fmtWater(2000)==="2 L" && fmtWater(2500)==="2,5 L","fmtWater formats");
// progInc
ok(progInc("Quadríceps")===5 && progInc("Bíceps")===2.5,"progInc by group");
// sessElapsedStr
ok(sessElapsedStr(0,65000)==="1:05" && sessElapsedStr(0,3661000)==="1:01:01","sessElapsedStr formats");
// TDEE (Mifflin) sanity: male 80kg 180cm 30y *1.55
const bmr=10*80+6.25*180-5*30+5;ok(Math.round(bmr)===1780,"TMB Mifflin formula");
console.log(fails?("VLOGIC_FAIL "+fails):"VLOGIC_OK");
