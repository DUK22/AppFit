"use strict";
function viewProgramas(){
  let h=`<div class="section-title" style="margin-top:8px">Programa de treino</div>
  <p class="muted" style="margin:0 0 6px;font-size:13.5px">Escolha qual treino seguir. O programa ativo comanda as abas <b>Hoje</b> e <b>Semana</b>. Seu histórico de cargas é guardado por exercício e continua valendo ao trocar.</p>`;
  PROG_ORDER.forEach(id=>{const p=PROGRAMS[id];if(!p)return;const active=state.programId===id;
    h+=`<div class="card" style="${active?'border-color:rgba(255,77,46,.5);box-shadow:0 0 0 1px rgba(255,77,46,.25),var(--shadow)':''}">
      <div class="row" style="gap:12px;align-items:flex-start"><div style="font-size:30px;line-height:1.1">${p.emoji}</div>
      <div style="flex:1;min-width:0"><div style="font-weight:800;font-size:16px">${esc(p.nome)} ${active?'<span class="pill ok" style="vertical-align:middle">ativo</span>':''}</div>
      <div class="muted" style="font-size:12px;margin:1px 0 6px">por ${esc(p.autor)} · ${progDaysSummary(p)}</div>
      <div class="muted" style="font-size:13px;line-height:1.4">${esc(p.desc)}</div>
      ${active?'':`<div style="height:10px"></div><button class="btn primary" data-activate="${id}">Usar este programa</button>`}
      </div></div></div>`;});
  h+=`<div class="hint" style="margin:10px 2px 0">Os treinos de atletas são aproximações para inspiração — ajuste cargas, volume e descanso ao seu nível e objetivo. Você pode trocar exercícios em cada treino na aba Hoje.</div>`;
  return h;
}
function openOnboard(){openSheet(`<h3>👋 Bem-vindo ao Treino</h3>
  <p class="muted" style="font-size:14px;margin:-2px 0 12px">Seu app de treino, dieta e atividades — funciona offline e pode ser instalado no celular e no PC.</p>
  <div class="note" style="margin:8px 0"><b>1.</b> Escolha um <b>programa</b> (seu ABCDE ou um do banco de atletas).</div>
  <div class="note" style="margin:8px 0"><b>2.</b> Na aba <b>Hoje</b>, marque os exercícios e registre carga × repetições.</div>
  <div class="note" style="margin:8px 0"><b>3.</b> Acompanhe <b>Dieta</b>, <b>Atividades</b> e <b>Corpo</b>. Em <b>⚙️</b> dá para sincronizar entre aparelhos.</div>
  <button class="btn primary block" id="obPrograms">Escolher meu programa</button>
  <div style="height:8px"></div><button class="btn ghost block" id="obClose">Começar agora</button>`);
  document.getElementById("obPrograms").onclick=()=>{markOnboarded();closeSheet();setTab("programas");};
  document.getElementById("obClose").onclick=()=>{markOnboarded();closeSheet();};}
console.log("OK");
