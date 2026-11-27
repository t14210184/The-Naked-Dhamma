#!/usr/bin/env node
import {readFileSync,writeFileSync,existsSync,mkdtempSync,mkdirSync,rmSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const file=resolve('history.html'),html=readFileSync(file,'utf8');
let failures=0;
function check(ok,msg){console.log((ok?'PASS ':'FAIL ')+msg);if(!ok)failures++;}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
check(ids.length===new Set(ids).size,'Unique IDs');
check([...html.matchAll(/href="#([^"]+)"/g)].every(x=>ids.includes(x[1])),'All internal anchors resolve');
check((html.match(/<section id="[^"]+" class="chapter">/g)||[]).length===23,'22 stations plus source library');
check((html.match(/<article class="evidence" id="s-[^"]+" data-source>/g)||[]).length===30,'30 evidence groups');
const js=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
check(js.length===1,'Single inline script');
for(const s of js){try{new Function(s);check(true,'JavaScript syntax')}catch(e){check(false,'JavaScript syntax '+e.message)}}
const chrome=process.env.CHROME_BIN||['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'].find(existsSync);
if(!chrome)throw Error('No Chrome binary; browser checks remain UNKNOWN');
const dir=mkdtempSync(join(tmpdir(),'history-test-')),imgs=resolve('qa-screenshots/history');mkdirSync(imgs,{recursive:true});
const proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-port=0','--remote-allow-origins=*','--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});
const sleep=n=>new Promise(r=>setTimeout(r,n));
let ws;
async function run(){
 let port=0;for(let i=0;i<100;i++){const p=join(dir,'DevToolsActivePort');if(existsSync(p)){port=Number(readFileSync(p,'utf8').split('\n')[0]);break;}await sleep(100);}if(!port)throw Error('Chrome CDP did not start');
 const list=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json(),page=list.find(x=>x.type==='page');if(!page)throw Error('No page');
 ws=new WebSocket(page.webSocketDebuggerUrl);
 await new Promise((ok,fail)=>{ws.addEventListener('open',ok,{once:true});ws.addEventListener('error',fail,{once:true});});
 let seq=0;const jobs=new Map(),exceptions=[];
 ws.addEventListener('message',e=>{let msg=JSON.parse(e.data);if(msg.method==='Runtime.exceptionThrown')exceptions.push(msg.params?.exceptionDetails?.text);if(msg.id&&jobs.has(msg.id)){const j=jobs.get(msg.id);jobs.delete(msg.id);msg.error?j.reject(Error(msg.error.message)):j.resolve(msg.result);}});
 function send(method,params={}){return new Promise((resolve,reject)=>{const id=++seq;jobs.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});}
 async function evaluate(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error('Runtime '+JSON.stringify(r.exceptionDetails));return r.result.value;}
 await send('Page.enable');await send('Runtime.enable');
 for(const w of [320,375,390,430,768,1440]){
 await send('Emulation.setDeviceMetricsOverride',{width:w,height:900,deviceScaleFactor:1,mobile:w<=430});
 await send('Page.navigate',{url:pathToFileURL(file).href});await sleep(600);
 const layout=await evaluate('(()=>{const d=document.documentElement;return {client:d.clientWidth,scroll:d.scrollWidth,body:document.body.scrollWidth,sections:document.querySelectorAll("main section").length,words:document.querySelector("main").innerText.length}})()');
 check(layout.client>0&&layout.scroll<=layout.client+2&&layout.body<=layout.client+2&&layout.sections===24&&layout.words>7000,'Responsive '+w+'px '+JSON.stringify(layout));
 if(w===320||w===390){
 await evaluate('(()=>{for(let i=0;i<4;i++)document.querySelector("#fontUp").click()})()');
 const big=await evaluate('(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,font:getComputedStyle(document.body).fontSize}))()');
 check(big.scroll<=big.client+2&&big.font==="28px",'Large reader text '+w+'px '+JSON.stringify(big));
 await evaluate('(()=>{for(let i=0;i<4;i++)document.querySelector("#fontDown").click()})()');
 }
 if(w===390){
 const interactions=await evaluate('(()=>{const result={};for(const id of ["q-four","q-teacher","q-kalama","q-rahula","q-evidence"]){const b=[...document.querySelectorAll("[aria-controls="+id+"]")];result[id]=b.length===3&&b.every(x=>{x.click();return document.getElementById(id).textContent===x.dataset.feedback&&x.getAttribute("aria-pressed")==="true"&&b.filter(y=>y.getAttribute("aria-pressed")==="true").length===1})}const patch=document.querySelector("#patch");for(let i=0;i<5;i++)patch.click();result.drum=patch.disabled&&document.querySelectorAll(".drum-patch.visible").length===5;document.querySelector("#reset-drum").click();result.reset=!patch.disabled&&document.querySelectorAll(".drum-patch.visible").length===0;document.querySelectorAll(".audit-check").forEach(c=>c.click());result.audit=document.querySelector("#audit-status").textContent.includes("7／7");const input=document.querySelector("#source-search");input.value="1258";input.dispatchEvent(new Event("input"));result.search=[...document.querySelectorAll("[data-source]")].filter(c=>!c.hidden).length>0&&[...document.querySelectorAll("[data-source]")].filter(c=>!c.hidden).length<30;input.value="";input.dispatchEvent(new Event("input"));result.clear=document.querySelectorAll("[data-source]:not([hidden])").length===30;return result})()');
 check(Object.values(interactions).every(Boolean),'All quiz options, drum, audit and source search '+JSON.stringify(interactions));
 await evaluate('(()=>{document.querySelector("#fontUp").focus();return document.activeElement.id})()');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
 check(await evaluate('parseFloat(getComputedStyle(document.body).fontSize)')>20,'Keyboard Enter activates font control');
 await evaluate('document.querySelector("#fontDown").click()');
 for(const [id,name] of [['top','mobile'],['drum','drum-mobile'],['lab','audit-mobile']]){
 await evaluate('document.getElementById('+JSON.stringify(id)+').scrollIntoView({behavior:"instant"})');await sleep(250);
 const shot=await send('Page.captureScreenshot',{format:'jpeg',quality:75,captureBeyondViewport:false});writeFileSync(join(imgs,name+'.jpg'),Buffer.from(shot.data,'base64'));
 }
 }
 if(w===1440){const shot=await send('Page.captureScreenshot',{format:'jpeg',quality:75,captureBeyondViewport:false});writeFileSync(join(imgs,'desktop.jpg'),Buffer.from(shot.data,'base64'));}
 }
 check(exceptions.length===0,'No browser exceptions '+JSON.stringify(exceptions));
 const noJs=join(dir,'nojs.html');writeFileSync(noJs,html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''),'utf8');
 await send('Page.navigate',{url:pathToFileURL(noJs).href});await sleep(500);
 const fallback=await evaluate('(()=>({words:document.querySelector("main").innerText.length,links:document.querySelectorAll("#library a[href^=https]").length,sections:document.querySelectorAll("main section").length}))()');
 check(fallback.words>7000&&fallback.links>=30&&fallback.sections===24,'Complete content without JavaScript '+JSON.stringify(fallback));
 console.log('HISTORY_QA_SUMMARY '+JSON.stringify({failures}));
}
try{await run()}catch(e){console.error('BROWSER_QA_FATAL '+e.stack);failures++;}finally{ws?.close();proc.kill('SIGKILL');await sleep(300);try{rmSync(dir,{recursive:true,force:true,maxRetries:10,retryDelay:200});}catch(e){console.warn('Temp Chrome profile cleanup deferred: '+e.message);}}
if(failures)process.exitCode=1;