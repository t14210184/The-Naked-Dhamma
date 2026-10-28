#!/usr/bin/env node
import {readFileSync,writeFileSync,existsSync,mkdtempSync,mkdirSync,rmSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const file=resolve('merit.html'),html=readFileSync(file,'utf8');
let failures=0;
function check(ok,msg){console.log((ok?'PASS ':'FAIL ')+msg);if(!ok)failures++;}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
check(!html.includes('末級'),'No unexplained Buddhist ranking jargon');
check(ids.length===new Set(ids).size,'Unique ID attributes');
check([...html.matchAll(/href="#([^"]+)"/g)].every(x=>ids.includes(x[1])),'Internal links target real IDs');
check((html.match(/class="evidence-card"/g)||[]).length===13,'All thirteen canonical source cards remain');
check(html.includes('隨藍')&&html.includes('養母')&&html.includes('生老病死')&&html.includes('data-cow'),'Long-form narratives and original animal parable remain');
const js=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
check(js.length===1,'One inline script');for(const src of js){try{new Function(src);check(true,'JavaScript syntax')}catch(e){check(false,'JavaScript syntax: '+e.message);}}
const chrome=process.env.CHROME_BIN||['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'].find(existsSync);
if(!chrome)throw Error('No Chrome binary; browser checks remain UNKNOWN');
const dir=mkdtempSync(join(tmpdir(),'merit-test-')),imgs=resolve('qa-screenshots');mkdirSync(imgs,{recursive:true});
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
  const m=await evaluate('(()=>{let d=document.documentElement;return {w:innerWidth,client:d.clientWidth,scroll:d.scrollWidth,body:document.body.scrollWidth,txt:document.querySelector("main").innerText.length,chapter:document.querySelectorAll("main section").length};})()');
  check(m.client>0&&m.scroll<=m.client+2&&m.body<=m.client+2&&m.txt>3000&&m.chapter>=15,'Responsive '+w+'px '+JSON.stringify(m));
  if(w===320){
   await evaluate('(()=>{for(let i=0;i<4;i++)document.querySelector("#fontUp").click();return 1;})()');
   const huge=await evaluate('(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,font:getComputedStyle(document.body).fontSize}))()');
   check(huge.client+2>=huge.scroll,'320px maximum reader font layout '+JSON.stringify(huge));
  }
  if(w===390){
   const interact=await evaluate('(()=>{document.querySelector("[data-answer=wisdom]").click();let a=document.querySelector("#quizResult").textContent;document.querySelector("[data-pot=pali]").click();let b=document.querySelector("#potResult").textContent;document.querySelector("[data-cow=white]").click();let c=document.querySelector("#cowResponse").textContent;document.querySelector("[data-ghost=none]").click();let d=document.querySelector("#ghostResult").textContent;return {quiz:a.includes("改變"),pots:b.includes("300 鍋"),cow:c.includes("毛色"),ghost:d.includes("施主")};})()');
   check(Object.values(interact).every(Boolean),'Interactive scenes '+JSON.stringify(interact));
   await evaluate('(()=>{for(let i=0;i<4;i++)document.querySelector("#fontUp").click();return 1;})()');
   const large=await evaluate('(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,font:getComputedStyle(document.body).fontSize,offenders:[...document.querySelectorAll("body *")].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+2&&r.width>0}).slice(0,10).map(e=>({tag:e.tagName,cls:String(e.className).slice(0,35),right:Math.ceil(e.getBoundingClientRect().right),width:Math.ceil(e.getBoundingClientRect().width)}))}))()');
   check(large.scroll<=large.client+2,'Enlarged 390px text has no overflow '+JSON.stringify(large));
   await evaluate('(()=>{for(let i=0;i<4;i++)document.querySelector("#fontDown").click();return 1;})()');
   const pic=await send('Page.captureScreenshot',{format:'jpeg',quality:70,captureBeyondViewport:false});writeFileSync(join(imgs,'mobile.jpg'),Buffer.from(pic.data,'base64'));
   if(process.env.QA_PRINT_PREVIEW==='1')console.log('SCREENSHOT_MOBILE_BASE64='+pic.data);
   await evaluate('(()=>{document.documentElement.style.scrollBehavior="auto";const target=document.querySelector(".cow-grid");window.scrollTo({top:window.scrollY+target.getBoundingClientRect().top-120,behavior:"instant"});return window.scrollY;})()');await sleep(250);
   const cowPosition=await evaluate('(()=>({top:Math.round(document.querySelector(".cow-grid").getBoundingClientRect().top),height:Math.round(document.querySelector(".cow-grid").getBoundingClientRect().height)}))()');
   check(cowPosition.top>=-4&&cowPosition.top<500,'Cow illustrations appear in the screenshot viewport '+JSON.stringify(cowPosition));
   const cowImage=await send('Page.captureScreenshot',{format:'jpeg',quality:70,captureBeyondViewport:false});
   writeFileSync(join(imgs,'cow-story-mobile.jpg'),Buffer.from(cowImage.data,'base64'));
   if(process.env.QA_PRINT_PREVIEW==='1')console.log('SCREENSHOT_COW_BASE64='+cowImage.data);
  }
  if(w===1440){const pic=await send('Page.captureScreenshot',{format:'jpeg',quality:58,captureBeyondViewport:false});writeFileSync(join(imgs,'desktop.jpg'),Buffer.from(pic.data,'base64'));if(process.env.QA_PRINT_PREVIEW==='1')console.log('SCREENSHOT_DESKTOP_BASE64='+pic.data);}
 }
 check(exceptions.length===0,'No browser exceptions '+JSON.stringify(exceptions));
 const noJs=join(dir,'nojs.html');writeFileSync(noJs,html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''),'utf8');
 await send('Page.navigate',{url:pathToFileURL(noJs).href});await sleep(420);
 const fallback=await evaluate('(()=>({words:document.querySelector("main").innerText.length,links:document.querySelectorAll("#library a[href^=https]").length}))()');
 check(fallback.words>3000&&fallback.links>=13,'Story readable with JavaScript removed '+JSON.stringify(fallback));
 console.log('BROWSER_QA_SUMMARY '+JSON.stringify({checks:'done',failures}));
}
try{await run()}catch(e){console.error('BROWSER_QA_FATAL '+e.stack);failures++;}finally{ws?.close();proc.kill('SIGKILL');await sleep(300);try{rmSync(dir,{recursive:true,force:true,maxRetries:10,retryDelay:200});}catch(e){console.warn('Temp Chrome profile cleanup deferred: '+e.message);}}
if(failures)process.exitCode=1;