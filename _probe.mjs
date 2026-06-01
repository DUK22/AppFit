import { JSDOM } from "jsdom";
import fs from "fs";
const html=fs.readFileSync("Treino.html","utf8");
const vc=new (await import("jsdom")).VirtualConsole();
vc.on("jsdomError",e=>console.log("JSDOMERR:",(e.detail&&(e.detail.stack||e.detail.message))||e.message));
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,virtualConsole:vc,url:"https://local/t"});
const {window}=dom;
window.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>({addColorStop(){}})});
await new Promise(r=>setTimeout(r,200));
for(const t of ["semana","peso","progresso","notas"]){
  try{ const out=window.eval(`view${t.charAt(0).toUpperCase()+t.slice(1)}()`); console.log(t,"=> length",out.length); }
  catch(e){ console.log(t,"THREW:", e.message); }
}
