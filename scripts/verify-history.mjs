import assert from "node:assert/strict";
import { readFileSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { chromium, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const html=readFileSync("history.html","utf8");
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(ids.length,new Set(ids).size,"duplicate IDs");
assert([...html.matchAll(/href="#([^"]+)"/g)].every(x=>ids.includes(x[1])),"broken internal anchors");
assert.equal((html.match(/data-station="/g)||[]).length,22);
assert.equal((html.match(/data-source>/g)||[]).length,30);
const engine=process.env.ENGINE||"chromium";
const output="qa-screenshots/history-"+engine;
mkdirSync(output,{recursive:true});
const server=createServer((req,res)=>{const path=req.url.split("?")[0];if(["/history.html","/index.html","/merit.html"].includes(path)){res.setHeader("content-type","text/html; charset=utf-8");res.end(readFileSync(path.slice(1)));}else{res.writeHead(404);res.end()}});
await new Promise(r=>server.listen(0,"127.0.0.1",r));
const base="http://127.0.0.1:"+server.address().port+"/history.html";
const browser=await ({chromium,webkit}[engine]).launch({headless:true});
let context;
const errors=[];
const check=async (p,desc)=>{assert(await p,desc);console.log("PASS "+desc)};
const shots=async(page,name)=>page.screenshot({path:output+"/"+name+".png",fullPage:false});
async function inspect(page,label){
 const a=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,visible:[...document.querySelectorAll("main section")].filter(x=>!x.hidden).map(x=>x.id),header:document.querySelector(".header").getBoundingClientRect().height,body:document.body.scrollHeight,theme:document.documentElement.dataset.theme}));
 assert(a.scroll<=a.client+2,label+" horizontal overflow "+JSON.stringify(a));
 assert(a.header<=64,label+" header exceeds target "+JSON.stringify(a));
 console.log("PASS "+label+" "+JSON.stringify(a));return a;
}
async function go(page,id){
 await page.goto(base+"#"+id);
 await page.waitForFunction(id=>{const target=document.getElementById(id);return document.documentElement.classList.contains("enhanced")&&!!target&&!target.closest("[hidden]")},id);
}
async function axe(page,label){
 const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
 if(result.violations.length)console.error(label,JSON.stringify(result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))));
 assert.equal(result.violations.length,0,label+" axe violations");console.log("PASS axe "+label);
}
try {
 context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,locale:"zh-TW"});
 await context.tracing.start({screenshots:true,snapshots:true,sources:true});
 const page=await context.newPage();page.on("pageerror",e=>errors.push(String(e)));
 await page.goto(base);
 await page.waitForFunction(()=>document.documentElement.classList.contains("enhanced")&&document.querySelector("#four").hidden);
 const landing=await inspect(page,"initial landing");
 assert.deepEqual(landing.visible,["top"]);assert(landing.body<6500,"landing unexpectedly long "+landing.body);
 assert.equal(await page.locator(".act").count(),4);assert.equal(await page.locator(".act[open]").count(),0);
 await shots(page,"landing-light");
 await axe(page,"light landing");
 await page.locator("#act-1 summary").click();
 await page.locator("#act-1 a[href='#four']").click();
 await page.waitForFunction(()=>!document.querySelector("#four").hidden);
 assert.deepEqual((await inspect(page,"station one")).visible,["four"]);
 for(const q of ["four","teacher","kalama","rahula","evidence"]){
  await go(page,q);
  const buttons=page.locator("[aria-controls=q-"+q+"]");assert.equal(await buttons.count(),3);
  for(let i=0;i<3;i++){const b=buttons.nth(i);await b.click();assert.equal(await b.getAttribute("aria-pressed"),"true");assert.equal(await page.locator("#q-"+q).textContent(),await b.getAttribute("data-feedback"));}
 }
 await go(page,"four");
 await shots(page,"station-light");
 await axe(page,"light quiz answered");
 await go(page,"drum");
 for(let i=0;i<5;i++)await page.locator("#patch").click();
 assert.equal(await page.locator(".drum-patch.visible").count(),5);assert(await page.locator("#patch").isDisabled());
 await page.locator("#mode-han").click();await page.locator("#patch").click();assert.equal(await page.locator("#leather").getAttribute("opacity"),"1");await shots(page,"drum-han");
 await page.locator("#reset-drum").click();assert.equal(await page.locator("#leather").getAttribute("opacity"),"0");
 await page.locator("#mode-pali").click();assert.equal(await page.locator(".drum-patch.visible").count(),0);
 await go(page,"lab");await page.locator("#audit-case").selectOption({label:"拈花微笑是否有早期文獻？"});await page.locator("#load-case").click();
 for(const c of await page.locator(".audit-check").all())await c.check();
 assert((await page.locator("#audit-status").textContent()).includes("7／7"));
 await page.reload();assert.equal(await page.locator(".audit-check:checked").count(),7);
 await page.locator("#copy-notes").click();
 await page.waitForFunction(()=>document.querySelector("#copy-status").textContent.length>0);
 assert((await page.locator("#notes-output").inputValue()).includes("並非真偽判定"));
 await page.locator("#reset-audit").click();assert.equal(await page.locator(".audit-check:checked").count(),0);
 await shots(page,"toolbox");
 await go(page,"library");
 await page.locator("#source-search").fill("ＡＮ ３.６５");
 assert(await page.locator("[data-source]:not([hidden])").count()>0);assert(await page.locator("[data-source]:not([hidden])").count()<30);
 await page.locator("[data-filter='阿育王']").click();assert(await page.locator("[data-source]:not([hidden])").count()>0);
 await page.locator("#clear-search").click();assert.equal(await page.locator("[data-source]:not([hidden])").count(),30);
 await shots(page,"library");
 await axe(page,"light source library");
 await go(page,"four");
 await page.locator("#four a[href='#s-four']").first().click();await page.waitForFunction(()=>!document.querySelector("#library").hidden);
 assert.equal(await page.locator("#source-back").getAttribute("href"),"#four");
 await page.locator("#source-back").click();await page.waitForFunction(()=>!document.querySelector("#four").hidden);
 await page.locator(".settings summary").click();await page.locator("#theme").click();
 assert.equal(await page.locator("html").getAttribute("data-theme"),"dark");
 await page.locator("#fontUp").focus();await page.keyboard.press("Enter");await page.keyboard.press("Space");
 assert.equal(await page.locator("#font-status").textContent(),"字級 24px");
 await page.locator("#fontUp").click();await page.locator("#fontUp").click();assert.equal(await page.locator("#font-status").textContent(),"字級 28px");
 await page.locator(".settings summary").click();
 await shots(page,"station-dark-large");
 await axe(page,"dark large quiz");
 for(const w of [320,375,390,430,768,1440]){
  await page.setViewportSize({width:w,height:900});
  for(const id of ["four","kalama","direction","branches","history","lab","library"]){await go(page,id);await inspect(page,id+" "+w+"px 28px dark");}
 }
 await page.setViewportSize({width:390,height:844});
 await go(page,"library");await axe(page,"dark library");
 await go(page,"china");
 await page.goto(base);await page.waitForFunction(()=>!document.querySelector("#resume").hidden);
 assert.equal(await page.locator("#resume-link").getAttribute("href"),"#china");
 await page.locator("#resume-link").click();await page.waitForFunction(()=>!document.querySelector("#china").hidden);
 await go(page,"all");assert.equal(await page.locator("[data-station]:not([hidden])").count(),22);
 await page.emulateMedia({media:"print"});await go(page,"four");assert.equal(await page.locator("#china").evaluate(e=>getComputedStyle(e).display),"block");
 await page.emulateMedia({media:"screen"});
 assert.deepEqual(errors,[],"uncaught page errors");
 const no=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const np=await no.newPage();await np.goto(base);assert.equal(await np.locator("[data-station]").count(),22);assert.equal(await np.locator("[data-source]").count(),30);assert.equal(await np.locator("[data-station][hidden]").count(),0);await np.locator("#act-3 summary").click();assert(await np.locator("#act-3 a[href='#china']").isVisible());await no.close();
 console.log("HISTORY_QA_SUMMARY "+JSON.stringify({engine,failures:0,stations:22,sourceGroups:30}));
} finally {
 if(context){await context.tracing.stop({path:output+"/trace.zip"}).catch(()=>{});await context.close();}
 await browser.close();server.close();
}
