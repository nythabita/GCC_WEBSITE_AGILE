import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createGccApi, validatePublicConfig } from '../src/lib/gcc-api.ts';
import { safeReturnTo } from '../shared/auth.ts';
import { fixtures } from './test-fixtures.ts';
const owner = '11111111-1111-4111-8111-111111111111';
const session = { userId: owner, accessToken: 'user-access-token' };
const receipt = { id: '33333333-3333-4333-8333-333333333333', user_id: owner, program_slug:'growthcamp', form_version:1, submitted_at:'2026-11-18T00:00:00Z' };

test('redirect and public config reject arbitrary destinations and privileged credentials', () => {
  for (const bad of ['https://evil.test','//evil.test','/login?next=/login','/\\evil','/unknown','/apply/growthx/form?next=https://evil.test']) assert.equal(safeReturnTo(bad), '/');
  assert.equal(safeReturnTo('/apply/growthx/form'), '/apply/growthx/form');
  assert.throws(()=>validatePublicConfig('', ''));
  assert.throws(()=>validatePublicConfig('http://evil.test','sb_publishable_test'));
  assert.throws(()=>validatePublicConfig('https://project.supabase.co','sb_secret_private'));
  assert.equal(validatePublicConfig('https://project.supabase.co','sb_publishable_test').url, 'https://project.supabase.co');
});

test('real HTTP transport sends only allowed fields with captured auth, and recovers duplicate receipt', async () => {
  let calls = 0; let duplicate = false;
  const server = createServer(async(req,res)=> {
    calls++; assert.equal(req.headers.authorization, 'Bearer user-access-token');
    assert.equal(req.headers.apikey,'sb_publishable_test');
    const chunks: Buffer[]=[]; for await (const chunk of req) chunks.push(Buffer.from(chunk));
    if(req.method==='POST') {
      const body=JSON.parse(Buffer.concat(chunks).toString());
      assert.deepEqual(Object.keys(body).sort(),['answers','program_slug']);
      assert.equal(body.answers.name,'Test Student');
      res.writeHead(duplicate?409:201,{'content-type':'application/json'}); res.end(JSON.stringify(duplicate?{code:'23505'}:[receipt]));
    } else { res.writeHead(200,{'content-type':'application/json'}); res.end(JSON.stringify([receipt])); }
  }); server.listen(0,'127.0.0.1'); await once(server,'listening');
  const address=server.address() as {port:number};
  const transport: typeof fetch = (url,options)=>fetch(String(url).replace('https://project.supabase.co',`http://127.0.0.1:${address.port}`), options);
  const api=createGccApi({url:'https://project.supabase.co',key:'sb_publishable_test'},transport);
  try {
    assert.equal((await api.submitApplication('growthcamp',fixtures.growthcamp,session)).id,receipt.id);
    duplicate=true; assert.equal((await api.submitApplication('growthcamp',fixtures.growthcamp,session)).id,receipt.id);
    const before=calls; await assert.rejects(api.submitApplication('growthcamp',{},session)); assert.equal(calls,before);
  } finally { server.close(); server.closeAllConnections(); }
});
test('failed/expired/malformed responses never become successful receipts or expose raw errors', async()=> {
  for (const [status,body] of [[401,{message:'private detail'}],[500,{message:'secret'}],[200,[]],[200,[{...receipt,user_id:'another-user'}]],[200,[{...receipt,id:'invalid'}]]] as const) {
    const api=createGccApi({url:'https://project.supabase.co',key:'sb_publishable_test'},async()=>new Response(JSON.stringify(body),{status}));
    await assert.rejects(api.submitApplication('growthcamp',fixtures.growthcamp,session), error=> error instanceof Error && !/private detail|secret/.test(error.message));
  }
});
