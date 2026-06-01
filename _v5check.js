"use strict";
// node --check validates SYNTAX only — verbatim copy of the v5 sync block.
const FB_CFG_KEY="treino_fb_cfg";
let CID=localStorage.getItem("treino_cid");if(!CID){CID="c"+Math.random().toString(36).slice(2)+Date.now().toString(36);try{localStorage.setItem("treino_cid",CID);}catch(e){}}
let fbApp=null,fbAuth=null,fbDb=null,fbUser=null,syncUnsub=null,applyingRemote=false,lastSyncJson=null,pushTimer=null,syncState="off";
function getFbCfg(){try{return JSON.parse(localStorage.getItem(FB_CFG_KEY)||"null");}catch(e){return null;}}
function setFbCfg(o){try{localStorage.setItem(FB_CFG_KEY,JSON.stringify(o));}catch(e){}}
function parseFbCfg(txt){if(!txt)return null;try{return JSON.parse(txt);}catch(e){}const m=txt.match(/\{[\s\S]*\}/);if(m){try{return (new Function("return ("+m[0]+")"))();}catch(e2){}}return null;}
function syncStateForCloud(){const o=Object.assign({},state);delete o.photos;return JSON.stringify(o);}
function loadFirebase(cb){if(window.firebase&&window.firebase.firestore){cb();return;}
  const v="10.12.2",base="https://www.gstatic.com/firebasejs/"+v+"/",files=["firebase-app-compat.js","firebase-auth-compat.js","firebase-firestore-compat.js"];
  let i=0;(function nx(){if(i>=files.length){cb();return;}const s=document.createElement("script");s.src=base+files[i++];s.onload=nx;s.onerror=()=>{syncState="error";alert("Não foi possível carregar o Firebase. Verifique a internet.");};document.head.appendChild(s);})();}
function fbInit(then){const cfg=getFbCfg();if(!cfg){if(then)then(false);return;}syncState="connecting";
  loadFirebase(()=>{try{fbApp=fbApp||firebase.initializeApp(cfg);fbAuth=firebase.auth();fbDb=firebase.firestore();
    fbAuth.onAuthStateChanged(u=>{fbUser=u;if(u){syncState="ready";attachSync();}else{syncState="off";detachSync();}if(overlay.classList.contains("open"))refreshSyncPanel();});
    if(then)then(true);}catch(e){syncState="error";alert("Configuração do Firebase inválida.");if(then)then(false);}});}
function attachSync(){if(!fbUser||!fbDb)return;detachSync();const ref=fbDb.collection("treino").doc(fbUser.uid);
  syncUnsub=ref.onSnapshot(snap=>{if(!snap.exists)return;const d=snap.data();if(!d||!d.state)return;if(d.state===lastSyncJson)return;applyRemote(d.state);},function(){syncState="error";});
  ref.get().then(snap=>{if(!snap.exists)cloudPush(true);}).catch(()=>{});}
function detachSync(){if(syncUnsub){try{syncUnsub();}catch(e){}syncUnsub=null;}}
function applyRemote(json){try{const remote=JSON.parse(json);applyingRemote=true;const photos=state.photos;
  state=Object.assign({},clone(defaultState),remote);state.photos=photos;
  state.settings=Object.assign({},defaultState.settings,state.settings||{});
  state.diet=Object.assign({},clone(DEFAULT_DIET),state.diet||{});state.diet.targets=Object.assign({kcal:0,p:0,c:0,f:0,water:0},state.diet.targets||{});state.diet.meals=state.diet.meals||clone(DEFAULT_DIET.meals);state.diet.customFoods=state.diet.customFoods||[];state.diet.log=state.diet.log||{};
  try{localStorage.setItem(LS_KEY,JSON.stringify(state));}catch(e){}lastSyncJson=json;applyingRemote=false;render();}catch(e){applyingRemote=false;}}
function cloudPushDebounced(){if(!fbUser||!fbDb)return;clearTimeout(pushTimer);pushTimer=setTimeout(()=>cloudPush(),900);}
function cloudPush(force){if(!fbUser||!fbDb)return;const json=syncStateForCloud();if(json===lastSyncJson&&!force)return;syncState="syncing";
  fbDb.collection("treino").doc(fbUser.uid).set({state:json,cid:CID,updatedAt:firebase.firestore.FieldValue.serverTimestamp(),v:5}).then(()=>{lastSyncJson=json;syncState="ready";}).catch(function(){syncState="error";});}
function fbLogin(em,pw,cb){fbAuth.signInWithEmailAndPassword(em,pw).then(()=>cb&&cb(null)).catch(e=>cb&&cb(e));}
function fbSignup(em,pw,cb){fbAuth.createUserWithEmailAndPassword(em,pw).then(()=>cb&&cb(null)).catch(e=>cb&&cb(e));}
function fbLogout(){try{if(fbAuth)fbAuth.signOut();}catch(e){}}
function fbErrMsg(e){const c=(e&&e.code)||"";if(/wrong-password|invalid-credential|user-not-found/.test(c))return "E-mail ou senha incorretos.";if(/email-already-in-use/.test(c))return "Este e-mail já tem conta — use Entrar.";if(/invalid-email/.test(c))return "E-mail inválido.";if(/weak-password/.test(c))return "Senha fraca (mínimo 6 caracteres).";if(/network/.test(c))return "Sem conexão com a internet.";return (e&&e.message)||"Erro ao entrar.";}
function syncLabel(){return syncState==="syncing"?"sincronizando…":syncState==="error"?"erro":syncState==="ready"?"sincronizado":syncState==="connecting"?"conectando…":"—";}
function refreshSyncPanel(){if(overlay.classList.contains("open"))openSync();}
function openSync(){const cfg=getFbCfg();let body;
  if(!cfg){body=`<h3>☁️ Sincronização na nuvem</h3>
    <p class="muted" style="font-size:13.5px;margin:-4px 0 10px">Cole a configuração do seu projeto Firebase (o objeto <b>firebaseConfig</b>). Passo a passo no arquivo <b>CONFIGURAR-SYNC.md</b>.</p>
    <label class="fld"><span>Configuração (firebaseConfig)</span><textarea id="fbCfg" rows="7" style="resize:vertical;font-family:monospace;font-size:12.5px" placeholder='{ "apiKey": "...", "authDomain": "...", "projectId": "...", "appId": "..." }'></textarea></label>
    <button class="btn primary block" id="fbSaveCfg">Salvar e conectar</button>
    <div style="height:8px"></div><button class="btn ghost block" onclick="closeSheet()">Fechar</button>`;}
  else if(!fbUser){body=`<h3>☁️ Entrar para sincronizar</h3>
    <div class="hint" style="margin:-4px 0 8px">${syncState==="connecting"?"Conectando ao Firebase…":syncState==="error"?"Erro de conexão — confira a configuração.":"Use o mesmo e-mail e senha nos dois aparelhos."}</div>
    <label class="fld"><span>E-mail</span><input type="email" id="fbEmail" autocomplete="username"></label>
    <label class="fld"><span>Senha</span><input type="password" id="fbPw" autocomplete="current-password"></label>
    <div class="row" style="gap:8px"><button class="btn primary" style="flex:1" id="fbLoginBtn">Entrar</button><button class="btn ghost" style="flex:1" id="fbSignupBtn">Criar conta</button></div>
    <div id="fbErr" class="hint" style="color:var(--accent);min-height:15px"></div>
    <div style="height:6px"></div><button class="btn ghost block" id="fbForget">Trocar configuração</button>
    <div style="height:6px"></div><button class="btn ghost block" onclick="closeSheet()">Fechar</button>`;}
  else{body=`<h3>☁️ Sincronização ativa</h3>
    <div class="swrow"><div><b>Conectado</b><div class="hint">${esc(fbUser.email||"")}</div></div><span class="pill ok">${syncLabel()}</span></div>
    <p class="muted" style="font-size:13px;margin:10px 0">Treino, dieta, atividades e medidas sincronizam automaticamente entre os aparelhos. As <b>fotos</b> ficam só neste aparelho.</p>
    <button class="btn ghost block" id="fbPushNow">Forçar envio agora</button>
    <div style="height:8px"></div><button class="btn ghost block" id="fbLogout" style="color:var(--accent)">Sair desta conta</button>
    <div style="height:6px"></div><button class="btn primary block" onclick="closeSheet()">Fechar</button>`;}
  openSheet(body);bindSyncPanel();}
function bindSyncPanel(){
  const sc=document.getElementById("fbSaveCfg");if(sc)sc.onclick=()=>{const cfg=parseFbCfg(document.getElementById("fbCfg").value);if(!cfg||!cfg.apiKey||!cfg.projectId){alert("Configuração inválida. Cole o objeto firebaseConfig completo (precisa ter apiKey e projectId).");return;}setFbCfg(cfg);fbApp=null;fbInit(()=>openSync());};
  const lb=document.getElementById("fbLoginBtn");if(lb)lb.onclick=()=>{const e=document.getElementById("fbEmail").value.trim(),p=document.getElementById("fbPw").value;if(!e||!p){document.getElementById("fbErr").textContent="Preencha e-mail e senha.";return;}document.getElementById("fbErr").textContent="Entrando…";fbLogin(e,p,err=>{if(err)document.getElementById("fbErr").textContent=fbErrMsg(err);});};
  const sb=document.getElementById("fbSignupBtn");if(sb)sb.onclick=()=>{const e=document.getElementById("fbEmail").value.trim(),p=document.getElementById("fbPw").value;if(!e||p.length<6){document.getElementById("fbErr").textContent="E-mail válido e senha de 6+ caracteres.";return;}document.getElementById("fbErr").textContent="Criando conta…";fbSignup(e,p,err=>{if(err)document.getElementById("fbErr").textContent=fbErrMsg(err);});};
  const fg=document.getElementById("fbForget");if(fg)fg.onclick=()=>{localStorage.removeItem(FB_CFG_KEY);detachSync();fbUser=null;fbApp=null;syncState="off";openSync();};
  const pn=document.getElementById("fbPushNow");if(pn)pn.onclick=()=>{cloudPush(true);setTimeout(refreshSyncPanel,400);};
  const lo=document.getElementById("fbLogout");if(lo)lo.onclick=()=>{fbLogout();};
}
console.log("OK");
