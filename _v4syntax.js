"use strict";
// node --check only validates SYNTAX; undeclared identifiers are fine.
// Verbatim copy of the DOM-heavy v4 functions to validate template literals/braces.
function dashCard(){const k=ymd(today()),tipo=planKeyForDate(today()),tot=dayTotal(tipo),dn=countDone(k,tipo);
  const con=dietConsumed(k),tg=dietS().targets,day=dietDay(k);
  const acts=(state.activities||[]).filter(a=>a.date===k),amin=acts.reduce((s,a)=>s+(+a.dur||0),0);
  const treinoTxt=PLANS[tipo].rest?"Descanso":`${dn}/${tot}`;
  return `<div class="dash">
    <div class="dcell" data-go="hoje"><div class="di">🏋️</div><div><div class="dv">${treinoTxt}</div><div class="dk">Treino de hoje</div></div></div>
    <div class="dcell" data-go="dieta"><div class="di">🍽️</div><div><div class="dv">${Math.round(con.kcal)}${tg.kcal>0?`<small> /${Math.round(tg.kcal)}</small>`:""}</div><div class="dk">kcal</div></div></div>
    <div class="dcell" data-go="dieta"><div class="di">💧</div><div><div class="dv">${fmtWater(day.water)}</div><div class="dk">Água</div></div></div>
    <div class="dcell" data-go="atividades"><div class="di">🔥</div><div><div class="dv">${acts.length?amin+`<small> min</small>`:"—"}</div><div class="dk">Atividade</div></div></div>
  </div>`;}
function viewAtividades(){
  const acts=[...(state.activities||[])].sort((a,b)=>a.date<b.date?1:(a.date>b.date?-1:0));
  const base=mondayOf(today()),wStart=ymd(base),wEnd=ymd(addDays(base,6));
  const wk=acts.filter(a=>a.date>=wStart&&a.date<=wEnd);
  const wMin=wk.reduce((s,a)=>s+(+a.dur||0),0),wKm=wk.reduce((s,a)=>s+(+a.dist||0),0),wKcal=wk.reduce((s,a)=>s+(+a.kcal||0),0);
  let h=`<div class="stats" style="grid-template-columns:repeat(3,1fr)">
    <div class="stat"><div class="v">${wk.length}</div><div class="k">Sessões (semana)</div></div>
    <div class="stat accent"><div class="v">${wMin}<small> min</small></div><div class="k">Tempo ativo</div></div>
    <div class="stat ok"><div class="v">${wKm>0?(+wKm.toFixed(1)).toString().replace(".",","):"0"}<small> km</small></div><div class="k">Distância</div></div></div>
  <div class="row" style="gap:10px;margin:4px 0 0"><button class="btn primary" id="addActivity" style="flex:1"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Registrar atividade</button><button class="btn ghost" id="stretchBtn" title="Alongamento">🧘</button></div>
  <div class="hint" style="margin:6px 2px 0">~${wKcal} kcal estimadas nesta semana. Registre corrida, esportes e lutas em qualquer dia — inclusive descanso.</div>
  <div class="section-title">Histórico</div>`;
  if(!acts.length)h+=`<div class="empty">Nenhuma atividade ainda.</div>`;
  else{let lastDate=null;acts.forEach(a=>{if(a.date!==lastDate){lastDate=a.date;const dt=parseYmd(a.date);h+=`<div style="font-size:12.5px;color:var(--txt3);font-weight:700;margin:16px 2px 6px">${WD_NAMES[dt.getDay()]}, ${dt.getDate()} ${MES[dt.getMonth()]}</div>`;}
    const m=actMeta(a.type);h+=`<div class="actcard"><div class="ai">${m[1]}</div><div class="ab"><div class="at">${esc(a.type)}</div><div class="am">${actDetail(a)||"—"}${a.notes?` · ${esc(a.notes)}`:""}</div></div><div class="ak">${a.kcal?a.kcal+" kcal":""}</div><span class="trash" data-delact="${a.id}"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg></span></div>`;});}
  return h;
}
let actState={type:"Corrida"};
function openActivity(dateKey){actState={type:"Corrida"};renderActivitySheet(dateKey||ymd(today()));}
function renderActivitySheet(dateKey){const sel=actState.type,dm=actMeta(sel)[3];
  openSheet(`<h3>➕ Registrar atividade</h3>
    <div class="actpick">${ACTS.map(a=>`<div class="ap ${a[0]===sel?'on':''}" data-ap="${esc(a[0])}"><span class="e">${a[1]}</span>${a[0]}</div>`).join("")}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">
      <label class="fld"><span>Data</span><input type="date" id="aDate" value="${dateKey}"></label>
      <label class="fld"><span>Duração (min)</span><input type="number" inputmode="numeric" id="aDur" value="${esc(actState.dur||'')}" placeholder="ex: 45"></label>
      ${dm?`<label class="fld"><span>Distância (km)</span><input type="number" inputmode="decimal" id="aDist" value="${esc(actState.dist||'')}" placeholder="ex: 5"></label>`:''}
      <label class="fld"><span>Intensidade</span><select id="aInt"><option value="leve">Leve</option><option value="moderado" selected>Moderada</option><option value="intenso">Intensa</option></select></label>
    </div>
    <label class="fld"><span>Observações (opcional)</span><input id="aObs" value="${esc(actState.notes||'')}" placeholder="ex: parque, com amigos..."></label>
    <div id="aOut" class="foodmacros"></div>
    <button class="btn primary block" id="aSave">Salvar atividade</button>
    <div style="height:8px"></div><button class="btn ghost block" onclick="closeSheet()">Cancelar</button>`);
  document.querySelectorAll("[data-ap]").forEach(el=>el.onclick=()=>{const dur=document.getElementById("aDur"),di=document.getElementById("aDist"),ob=document.getElementById("aObs");
    actState.dur=dur?dur.value:"";actState.dist=di?di.value:"";actState.notes=ob?ob.value:"";actState.type=el.dataset.ap;renderActivitySheet(document.getElementById("aDate").value||dateKey);});
  const dur=document.getElementById("aDur"),int=document.getElementById("aInt");
  function upd(){const m=parseFloat(dur.value)||0;document.getElementById("aOut").innerHTML=m>0?`<span>~ <b>${actKcal(sel,m,int.value)}</b> kcal estimadas</span>`:"";}
  dur.oninput=upd;int.onchange=upd;upd();
  document.getElementById("aSave").onclick=()=>{const m=parseFloat(dur.value)||0;if(!(m>0)){dur.focus();return;}
    const di=document.getElementById("aDist"),dist=dm&&di?(parseFloat(di.value)||0):0;
    state.activities=state.activities||[];
    state.activities.push({id:"a"+Date.now().toString(36),date:document.getElementById("aDate").value||ymd(today()),type:sel,dur:m,dist:dist,intensity:int.value,kcal:actKcal(sel,m,int.value),notes:document.getElementById("aObs").value.trim()});
    save();closeSheet();render();};
}
function openStretch(){
  openSheet(`<h3>🧘 Alongamento</h3>
    <p class="muted" style="margin:-4px 0 12px;font-size:13.5px">Sequências guiadas que avançam sozinhas, com aviso sonoro na troca.</p>
    <button class="btn primary block" id="rotShort">Rotina curta · ~4 min</button>
    <div style="height:8px"></div><button class="btn primary block" id="rotFull">Rotina completa · ~10 min</button>
    <div class="section-title">Por grupo muscular</div>
    <div class="row" style="gap:7px;flex-wrap:wrap">${[...new Set(STRETCHES.map(s=>s[1]))].map(g=>`<button class="chip" data-sgrp="${esc(g)}">${g}</button>`).join("")}</div>
    <div style="height:12px"></div><button class="btn ghost block" onclick="closeSheet()">Fechar</button>`);
  document.getElementById("rotShort").onclick=()=>startStretch(ROT_CURTA,"Rotina curta");
  document.getElementById("rotFull").onclick=()=>startStretch(ROT_COMPLETA,"Rotina completa");
  document.querySelectorAll("[data-sgrp]").forEach(b=>b.onclick=()=>{const g=b.dataset.sgrp,seq=STRETCHES.map((s,i)=>i).filter(i=>STRETCHES[i][1]===g);startStretch(seq,g);});
}
let stretch={seq:[],idx:0,end:0,int:null,paused:false,left:0,title:""};
function startStretch(seq,title){if(!seq||!seq.length)return;stretch={seq:seq.slice(),idx:0,title,paused:false,int:null,left:0,end:0};stretchStep();}
function stretchStep(){const s=STRETCHES[stretch.seq[stretch.idx]];if(!s){stretchDone();return;}
  stretch.left=s[2];stretch.end=Date.now()+s[2]*1000;stretch.paused=false;renderStretch();
  if(stretch.int)clearInterval(stretch.int);stretch.int=setInterval(stretchTick,200);}
function renderStretch(){const s=STRETCHES[stretch.seq[stretch.idx]];if(!s)return;
  const dots=stretch.seq.map((_,k)=>`<i class="${k<stretch.idx?'cdone':(k===stretch.idx?'on':'')}"></i>`).join("");
  openSheet(`<h3 style="justify-content:space-between">${esc(stretch.title)}<span style="font-size:13px;color:var(--txt3);font-weight:600">${stretch.idx+1}/${stretch.seq.length}</span></h3>
    <div class="stretchview"><div class="sg">${s[1]}</div><div class="sn">${s[0]}</div><div class="sd">${s[3]}</div>
      <div class="bignum" id="sNum">${stretch.left}</div><div class="stepdots">${dots}</div></div>
    <div class="row" style="gap:8px"><button class="btn ghost" id="sPrev" style="flex:1">◀</button><button class="btn ghost" id="sPause" style="flex:1.4">${stretch.paused?"Continuar":"Pausar"}</button><button class="btn primary" id="sNext" style="flex:1">▶</button></div>
    <div style="height:8px"></div><button class="btn ghost block" id="sStop">Encerrar</button>`);
  document.getElementById("sPrev").onclick=()=>{if(stretch.idx>0){stretch.idx--;stretchStep();}};
  document.getElementById("sNext").onclick=()=>{stretch.idx++;if(stretch.idx>=stretch.seq.length)stretchDone();else stretchStep();};
  document.getElementById("sStop").onclick=()=>{stopStretch();closeSheet();};
  document.getElementById("sPause").onclick=function(){stretch.paused=!stretch.paused;if(!stretch.paused)stretch.end=Date.now()+stretch.left*1000;this.textContent=stretch.paused?"Continuar":"Pausar";};
}
function stretchTick(){const el=document.getElementById("sNum");if(!el){stopStretch();return;}if(stretch.paused)return;
  stretch.left=Math.max(0,Math.round((stretch.end-Date.now())/1000));el.textContent=stretch.left;
  if(stretch.left<=0){beep();stretch.idx++;if(stretch.idx>=stretch.seq.length)stretchDone();else stretchStep();}}
function stopStretch(){if(stretch.int){clearInterval(stretch.int);stretch.int=null;}}
function stretchDone(){stopStretch();try{if(navigator.vibrate)navigator.vibrate([120,60,120]);}catch(e){}
  openSheet(`<h3>✅ Alongamento concluído</h3><p class="muted" style="margin:0">Boa! Sessão finalizada — isso ajuda na mobilidade e na recuperação muscular.</p><div style="height:12px"></div><button class="btn primary block" onclick="closeSheet()">Fechar</button>`);}
const ACTS=[];const STRETCHES=[];const ROT_CURTA=[];const ROT_COMPLETA=[];
function actMeta(){}function actKcal(){}function actDetail(){}function fmtWater(){}
console.log("OK");
