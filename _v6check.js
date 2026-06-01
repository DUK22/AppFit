"use strict";
function E(grupo,nome,series,reps,obs){return {grupo,nome,series,reps:reps||"",obs:obs||""};}
function esc(s){return String(s==null?"":s).replace(/"/g,"&quot;");}
function openSheet(){}function closeSheet(){}function setTab(){}function markOnboarded(){}
const PLANS={A:{tipo:"A",titulo:"Treino A",dia:"Segunda",foco:"Costas",ex:[E("Costas","Puxada",3,"10")]},REC:{tipo:"REC",rest:true,ex:[E("x","y","","","")]},OFF:{tipo:"OFF",rest:true,ex:[E("x","y","","","")]},B:{tipo:"B",titulo:"B",dia:"Terça",foco:"Peito",ex:[E("Peito","Supino",3,"10")]},C1:{titulo:"C1",dia:"Quarta",foco:"Pernas",ex:[E("Quadríceps","Agacho",3,"10")]},C2:{titulo:"C2",dia:"Quarta",foco:"Pernas",ex:[E("Quadríceps","Hack",3,"10")]},D1:{titulo:"D1",dia:"Sexta",foco:"Braços",ex:[]},D2:{titulo:"D2",dia:"Sexta",foco:"Braços",ex:[]},E:{titulo:"E",dia:"Sábado",foco:"Full",ex:[]}};
let state={programId:"refundini",overrides:{}};
function cycleParity(){return 0;}

/* ---- verbatim refactored helpers ---- */
function refundiniKey(d){const wd=d.getDay(),p=cycleParity(d);
  if(wd===1)return"A";if(wd===2)return"B";if(wd===3)return p===0?"C1":"C2";if(wd===4)return"REC";if(wd===5)return p===0?"D1":"D2";if(wd===6)return"E";return"OFF";}
function planKeyForDate(d){return actProg().keyForDate(d);}
function actProg(){return PROGRAMS[state.programId]||PROGRAMS.refundini;}
function PLN(tipo){const p=actProg();if(p.plans&&p.plans[tipo])return p.plans[tipo];for(const id in PROGRAMS){if(PROGRAMS[id].plans&&PROGRAMS[id].plans[tipo])return PROGRAMS[id].plans[tipo];}return PLANS[tipo]||{tipo:tipo,titulo:tipo,foco:"",dia:"",ex:[]};}
function exAt(tipo,i){const base=(PLN(tipo).ex||[])[i]||{nome:"—",grupo:"",series:"",reps:"",obs:""};return Object.assign({},base,(state.overrides[tipo]||{})[i]||{});}

/* ---- verbatim PROGRAMS block ---- */
function weekProg(id,nome,autor,emoji,desc,week){const plans={};week.forEach(d=>{plans[d.t]=d;});return {id:id,nome:nome,autor:autor,emoji:emoji,desc:desc,cycle:false,plans:plans,keyForDate:function(d){return week[d.getDay()].t;}};}
function _d(t,titulo,dia,foco,ex){return {t:t,tipo:t,titulo:titulo,dia:dia,foco:foco,ex:ex};}
function _off(t){return {t:t,tipo:t,titulo:"Descanso",dia:"Descanso",foco:"Recuperação",rest:true,ex:[E("Recuperação","Descanso completo","","","Sem treino planejado")]};}
const SAITAMA_DAY=_d("SAITAMA","Treino do Saitama","Diário","Calistenia — todos os dias",[
  E("Peito","Flexões (push-ups)","","100 reps","Meta diária — divida em séries se precisar"),
  E("Abdômen","Abdominais (sit-ups)","","100 reps","Meta diária"),
  E("Quadríceps","Agachamentos (squats)","","100 reps","Meta diária"),
  E("Cardio","Corrida","","10 km","Todos os dias")]);
const PROGRAMS={
  refundini:{id:"refundini",nome:"ABCDE + Full Body",autor:"Laércio Refundini",emoji:"🗓️",desc:"...",cycle:true,plans:PLANS,keyForDate:refundiniKey},
  saitama:weekProg("saitama","Treino do Saitama","One Punch Man","🥊","100 flexões...",[SAITAMA_DAY,SAITAMA_DAY,SAITAMA_DAY,SAITAMA_DAY,SAITAMA_DAY,SAITAMA_DAY,SAITAMA_DAY]),
  ramondino:weekProg("ramondino","Ramon Dino","Classic Physique","🏆","...",[
    _off("RD_OFF"),
    _d("RD_PEITRI","Peito e Tríceps","Segunda","Peito + tríceps",[E("Peito","Supino inclinado halteres 30º",4,"8-12"),E("Tríceps","Tríceps francês",3,"10-12")]),
    _d("RD_COSBI","Costas e Bíceps","Terça","Costas + bíceps",[E("Costas","Puxada frente (pulldown)",4,"8-12")]),
    _d("RD_PERNA","Pernas","Quarta","Pernas completas",[E("Quadríceps","Agachamento livre",4,"8-12")]),
    _d("RD_OMBRO","Ombros e Trapézio","Quinta","Ombros",[E("Lateral de Ombro","Elevação lateral halteres",4,"12-15")]),
    _d("RD_BRACO","Braços","Sexta","Braços",[E("Bíceps","Rosca Scott máquina",4,"10-12")]),
    _d("RD_POST","Posterior e Glúteo","Sábado","Posterior",[E("Posterior de Coxa","Stiff com barra",4,"8-12")])]),
  arnold:weekProg("arnold","Arnold — Era de Ouro","Arnold Schwarzenegger","💪","...",[
    _off("AR_OFF"),_d("AR_PC1","Peito e Costas","Segunda","x",[E("Peito","Supino reto barra",5,"8-12")]),
    _d("AR_OB1","Ombros e Braços","Terça","x",[E("Lateral de Ombro","Desenvolvimento militar",5,"8-12")]),
    _d("AR_PERNA","Pernas","Quarta","x",[E("Quadríceps","Agachamento livre",5,"8-12")]),
    _d("AR_PC2","Peito e Costas","Quinta","x",[E("Peito","Supino inclinado barra",5,"8-12")]),
    _d("AR_OB2","Ombros e Braços","Sexta","x",[E("Anterior de Ombro","Desenvolvimento Arnold",5,"8-12")]),
    _d("AR_PERNA2","Pernas e Abdômen","Sábado","x",[E("Quadríceps","Agachamento hack",4,"10-12")])]),
  cbum:weekProg("cbum","Push Pull Legs (CBum)","Chris Bumstead","🥇","...",[
    _off("CB_OFF"),_d("CB_PUSH1","Push","Segunda","x",[E("Peito","Supino inclinado halteres 30º",4,"8-12")]),
    _d("CB_PULL1","Pull","Terça","x",[E("Costas","Puxada frente (pulldown)",4,"8-12")]),
    _d("CB_LEGS1","Legs","Quarta","x",[E("Quadríceps","Agachamento livre",4,"8-12")]),
    _d("CB_PUSH2","Push","Quinta","x",[E("Peito","Supino reto halteres",4,"8-12")]),
    _d("CB_PULL2","Pull","Sexta","x",[E("Costas","Barra fixa",4,"até a falha")]),
    _d("CB_LEGS2","Legs","Sábado","x",[E("Quadríceps","Agachamento hack",4,"10-12")])])
};
const PROG_ORDER=["refundini","saitama","ramondino","arnold","cbum"];
function progDaysSummary(p){if(p.cycle)return "5 treinos/semana · ABCDE + Full Body";let tr=0;for(let i=0;i<7;i++){const t=p.keyForDate({getDay:function(){return i;}});if(!(p.plans[t]||{}).rest)tr++;}return tr+" treinos por semana";}

// ---- asserts ----
let f=0;const ok=(c,m)=>{if(!c){f++;console.log("FAIL:",m);}};
const D=(wd)=>({getDay:()=>wd});
ok(PROG_ORDER.length===5&&Object.keys(PROGRAMS).length===5,"5 programas");
ok(actProg().id==="refundini","default refundini");
state.programId="saitama";
ok(actProg().nome==="Treino do Saitama","troca para saitama");
ok(planKeyForDate(D(1))==="SAITAMA"&&planKeyForDate(D(0))==="SAITAMA","saitama todo dia");
ok(PLN("SAITAMA").ex.length===4,"saitama 4 exercícios");
ok(progDaysSummary(PROGRAMS.saitama)==="7 treinos por semana","saitama 7/sem");
ok(progDaysSummary(PROGRAMS.ramondino)==="6 treinos por semana","ramondino 6/sem (got "+progDaysSummary(PROGRAMS.ramondino)+")");
ok(progDaysSummary(PROGRAMS.cbum)==="6 treinos por semana","cbum 6/sem");
state.programId="ramondino";
ok(planKeyForDate(D(1))==="RD_PEITRI"&&planKeyForDate(D(0))==="RD_OFF","ramondino seg/dom");
ok(PLN("RD_PERNA").ex[0].nome==="Agachamento livre","ramondino quarta");
// defensive cross-program lookup while active=ramondino
ok(PLN("AR_PC1").titulo==="Peito e Costas","acha tipo de outro programa (histórico)");
ok(PLN("INEXISTENTE").ex.length===0,"fallback seguro p/ tipo inexistente");
ok(exAt("SAITAMA",0).nome==="Flexões (push-ups)","exAt resolve entre programas");
ok(exAt("SAITAMA",99).nome==="—","exAt índice fora do range não quebra");
// refundini cycle still works
state.programId="refundini";
ok(planKeyForDate(D(1))==="A"&&planKeyForDate(D(4))==="REC"&&planKeyForDate(D(6))==="E","refundini mantém ABCDE");
console.log(f?("VLOGIC_FAIL "+f):"VLOGIC_OK");
