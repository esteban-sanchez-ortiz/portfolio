import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
await build({entryPoints:['worker/src/chat.ts','src/hooks/useSanchoChat/readSanchoStream.ts'],outdir:'/tmp/sancho-tests',bundle:true,platform:'node',format:'esm',outExtension:{'.js':'.mjs'}})
const { streamChat } = await import('/tmp/sancho-tests/worker/src/chat.mjs')
const { readSanchoStream } = await import('/tmp/sancho-tests/src/hooks/useSanchoChat/readSanchoStream.mjs')
const originalFetch = globalThis.fetch
after(()=>{globalThis.fetch=originalFetch})
const targets=[{provider:'fireworks',model:'accounts/fireworks/models/nemotron-lightning-3p5-30b-a3b',apiKey:'test-only'},{provider:'groq',model:'openai/gpt-oss-20b',apiKey:'test-only'}]
const data = text => `data: ${JSON.stringify({choices:[{delta:{content:text,reasoning_content:'DO NOT SHOW'}}]})}\n\n`
const done='data: [DONE]\n\n'
const answer = async (responses, timeout=30) => {const calls=[];globalThis.fetch=async(url,req)=>{calls.push({url,body:JSON.parse(req.body)}); const r=responses.shift();return typeof r==='function'?r(req):r};const res=await streamChat(targets,'selected language',[{role:'user',content:'hola'}],'TEST_CANARY',timeout);return {text:await res.text(),calls}}
test('Fireworks content only and bounded request',async()=>{const r=await answer([new Response(data('Hola')+done)]);assert.match(r.text,/Hola/);assert.doesNotMatch(r.text,/DO NOT SHOW/);assert.equal(r.calls.length,1);assert.equal(r.calls[0].body.reasoning_effort,'none');assert.equal(r.calls[0].body.max_tokens,350)})
for(const status of [404,408,429,500]) test(`fallback once for ${status}`,async()=>{const r=await answer([new Response('',{status}),new Response(data('Hello')+done)]);assert.equal(r.calls.length,2);assert.match(r.text,/Hello/);assert.equal(r.calls[1].body.include_reasoning,false);assert.equal(r.calls[1].body.reasoning_effort,'low')})
test('credentials rejection does not retry',async()=>{const r=await answer([new Response('',{status:401})]);assert.equal(r.calls.length,1);assert.match(r.text,/unavailable/)})
test('timeout falls back',async()=>{const r=await answer([req=>new Promise((_,reject)=>req.signal.addEventListener('abort',()=>reject(new Error('aborted')))),new Response(data('Recovered')+done)],5);assert.equal(r.calls.length,2);assert.match(r.text,/Recovered/)})
test('truncated before content falls back',async()=>{const r=await answer([new Response(''),new Response(data('Recovered')+done)]);assert.equal(r.calls.length,2)})
test('partial stream never concatenates another provider',async()=>{const r=await answer([new Response(data('Partial')),new Response(data('Other')+done)]);assert.equal(r.calls.length,1);assert.match(r.text,/Partial/);assert.match(r.text,/unavailable/);assert.doesNotMatch(r.text,/Other/)})
test('canary blocked without fallback',async()=>{const r=await answer([new Response(data('TEST_CANARY')+done)]);assert.equal(r.calls.length,1);assert.match(r.text,/blocked/);assert.doesNotMatch(r.text,/TEST_CANARY/)})
test('missing primary secret returns 503',async()=>{const r=await streamChat([{...targets[0],apiKey:''},targets[1]],'',[],'');assert.equal(r.status,503)})
const body = value => new Response(value).body
for(const text of ['Hola, español','Hello, English']) test(`client accepts ${text} with final line`,async()=>{let out='';assert.equal(await readSanchoStream(body(`data: ${JSON.stringify({delta:text})}\n\ndata: [DONE]`),s=>out+=s),true);assert.equal(out,text)})
for(const value of [done,'data: {"delta":"partial"}\n','data: {"error":"unavailable"}\n\n'+done,'data: not-json\n']) test(`client rejects incomplete/error ${value.slice(0,30)}`,async()=>{assert.equal(await readSanchoStream(body(value),()=>{}),false)})
test('UTF8 split across bytes is preserved',async()=>{const bytes=new TextEncoder().encode('data: {"delta":"ñ"}\n\ndata: [DONE]');const stream=new ReadableStream({start(c){for(const byte of bytes)c.enqueue(new Uint8Array([byte]));c.close()}});let out='';assert.equal(await readSanchoStream(stream,s=>out+=s),true);assert.equal(out,'ñ')})
await build({entryPoints:['worker/src/sanitize.ts','worker/src/guard.ts','worker/src/leads.ts','worker/src/prompt.ts'],outdir:'/tmp/sancho-validation',bundle:true,platform:'node',format:'esm',loader:{'.md':'text'},outExtension:{'.js':'.mjs'}})
const { stripUnsafeCharacters } = await import('/tmp/sancho-validation/sanitize.mjs')
const { validateMessages } = await import('/tmp/sancho-validation/guard.mjs')
const { validateLead } = await import('/tmp/sancho-validation/leads.mjs')
const { buildSystemPrompt } = await import('/tmp/sancho-validation/prompt.mjs')
test('sanitizer preserves old behavior across every BMP character and surrogate pairs',()=>{
 const all=Array.from({length:65536},(_,i)=>String.fromCharCode(i)).join('')+'😀'
 const old=all.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028\u2029\u202A-\u202E\uFEFF]/g,'')
 assert.equal(stripUnsafeCharacters(all),old)
 assert.equal(stripUnsafeCharacters('a\t\n\rb'),'a\t\n\rb')
})
test('message and lead validation still remove hidden controls',()=>{
 const result=validateMessages({messages:[{role:'user',content:'  ho\u200bla\u0000  '}]})
 assert.equal(result.ok,true);assert.equal(result.messages[0].content,'hola')
 const lead=validateLead({name:'Te\u0000st',company:'Example',email:'test@example.com'})
 assert.equal(lead.name,'Test');assert.equal(validateLead({name:'x',company:'y',email:'invalid'}),null)
})
for(const [lang,expected] of [['es','SPANISH'],['en','ENGLISH']])test(`selected ${lang} system preference and no fabricated scheduling`,()=>{
 const prompt=buildSystemPrompt('TEST_ONLY_CANARY',lang)
 assert.match(prompt,new RegExp(`reply ONLY in ${expected}`))
 assert.match(prompt,/Never invent facts/)
 assert.match(prompt,/No booking tool is connected/)
 assert.doesNotMatch(prompt,/40%|85%|10,000|Bachelor of|Mon–Fri 8:00/)
})
