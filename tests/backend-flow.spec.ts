import { test, expect, type Page } from '@playwright/test';

const owner = '11111111-1111-4111-8111-111111111111';
const savedId = '33333333-3333-4333-8333-333333333333';
async function signInFixture(page: Page) {
  const expiry = Math.floor(Date.now()/1000)+3600;
  const token = `${Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url')}.${Buffer.from(JSON.stringify({sub:owner,role:'authenticated',aud:'authenticated',exp:expiry})).toString('base64url')}.test-signature`;
  const user = {id:owner,email:'tester@example.com',aud:'authenticated',role:'authenticated',app_metadata:{provider:'email',providers:['email']},user_metadata:{full_name:'Test Student'},created_at:'2026-11-18T00:00:00Z',email_confirmed_at:'2026-11-18T00:00:00Z',is_anonymous:false};
  await page.addInitScript(({token,expiry,user})=>{ if(sessionStorage.getItem('fixture-seeded'))return;sessionStorage.setItem('fixture-seeded','yes');localStorage.setItem('sb-svyulvjezdzgooywntyl-auth-token',JSON.stringify({access_token:token,refresh_token:'test-refresh-token',expires_in:3600,expires_at:expiry,token_type:'bearer',user})); },{token,expiry,user});
}

async function completeForm(page: Page, steps = 4) {
  await expect(page.locator('form')).toBeVisible();
  for(let i=0;i<steps;i++) {
    for(const group of await page.locator('form fieldset[data-field]').all()) {
      const boxes=group.locator('input[type=checkbox]'); if(await boxes.count() && !await group.locator('input[type=checkbox]:checked').count()) await boxes.first().check();
    }
    const names=await page.locator('form input[type=radio]').evaluateAll(elements=>[...new Set(elements.map(e=>(e as HTMLInputElement).name))]);
    for(const name of names) {const radios=page.locator(`form input[type=radio][name="${name}"]`); if(!await page.locator(`form input[type=radio][name="${name}"]:checked`).count())await radios.first().check();}
    for(const box of await page.locator('form div[data-field] input[type=checkbox]').all())await box.check();
    // Select controlling choices before filling dependent inputs (areas can replace explanation fields).
    for(const field of await page.locator('form input[type=text]:not([disabled]),form textarea').all()) {
      const mode=await field.getAttribute('inputmode'); await field.fill(mode==='email'?'tester@example.com':mode==='url'?'https://example.com/work':'Jawaban uji');
    }
    await page.locator('form button[type=submit]').click();
  }
  if (steps === 4) await expect(page.getByRole('button',{name:'Kirim Pengajuan',exact:true})).toBeEnabled();
}

test('a logged-out visitor must sign in before accessing a program form', async ({page})=> {
  await page.goto('/apply/growthx/form');
  await expect(page).toHaveURL(/\/login\?next=/);
  await expect(page.getByRole('heading',{name:'Sign in to GCC'})).toBeVisible();
  await expect(page.getByText('Prototype: tap the field to use a demo email.')).toHaveCount(0);
});
test('an OTP request failure stays on sign in and does not fabricate a verification session', async ({page})=> {
  await page.route('**/auth/v1/otp',route=>route.fulfill({status:500,contentType:'application/json',body:JSON.stringify({msg:'Mail provider unavailable'})}));
  await page.goto('/login');
  await page.getByLabel('Email address',{exact:true}).fill('tester@example.com');
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('heading',{name:'Check your email'})).toHaveCount(0);
  await expect(page.getByText('You’re signed in',{exact:true})).toHaveCount(0);
});
test('homepage reports API failure honestly and exposes retry', async ({page})=> {
  await page.route('**/rest/v1/homepage_content*', route=>route.fulfill({status:503,body:'Unavailable'}));
  await page.goto('/');
  await expect(page.getByRole('button',{name:'Coba lagi',exact:true})).toBeVisible();
  await expect(page.getByRole('alert')).toBeVisible();
});

for(const [slug,path] of [['growthcamp','/learn/growthcamp/form'],['growthx','/apply/growthx/form'],['growthconnect','/apply/growthconnect/form']] as const) {
  test(`${slug}: failed save preserves form, successful save shows server receipt, reload shows existing submission`, async({page})=> {
    await signInFixture(page); let fail=true; let stored=false; let posts=0;
    const receipt={id:savedId,user_id:owner,program_slug:slug,form_version:1,submitted_at:'2026-11-18T00:00:00Z'};
    await page.route('**/rest/v1/program_applications*',async route=> {
      if(route.request().method()==='POST') {
        posts++; const payload=route.request().postDataJSON(); expect(Object.keys(payload).sort()).toEqual(['answers','program_slug']); expect(payload.program_slug).toBe(slug);
        if(fail){await route.fulfill({status:503,body:'unavailable'});return;}
        stored=true;await route.fulfill({status:201,contentType:'application/json',body:JSON.stringify([receipt])});
      }else await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(stored?[receipt]:[])});
    });
    await page.goto(path); await completeForm(page);
    await page.getByRole('button',{name:'Kirim Pengajuan',exact:true}).click();
    await expect(page.getByRole('alert')).toBeVisible(); await expect(page.getByText(savedId,{exact:true})).toHaveCount(0);
    await expect(page.getByRole('heading',{name:/Review/})).toBeVisible();
    fail=false; await page.getByRole('button',{name:'Kirim Pengajuan',exact:true}).click();
    await expect(page.getByText(savedId,{exact:true})).toBeVisible(); expect(posts).toBe(2);
    await page.reload(); await expect(page.getByText(savedId,{exact:true})).toBeVisible();
    await expect(page.getByRole('button',{name:'Kirim Pengajuan',exact:true})).toHaveCount(0);
  });
}
test('signed-in user can sign out from navigation', async({page})=> {
  await signInFixture(page);
  await page.route('**/auth/v1/logout*',route=>route.fulfill({status:204}));
  await page.goto('/programs'); await page.getByRole('button',{name:/Buka menu/}).click();
  await page.getByRole('button',{name:'Logout',exact:true}).click();
  await page.goto('/apply/growthx/form'); await expect(page).toHaveURL(/\/login\?next=/);
});
test('changing selected contribution areas keeps each explanation attached to its area', async({page})=> {
  await signInFixture(page);
  await page.route('**/rest/v1/program_applications*',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
  await page.goto('/apply/growthx/form'); await completeForm(page,1);
  const areas=page.locator('fieldset[data-field="areas"]');
  await areas.getByLabel('Analisis data',{exact:true}).check(); await areas.getByLabel('Pemasaran',{exact:true}).check();
  await page.locator('textarea[name="abilities.0"]').fill('Analysis ability'); await page.locator('textarea[name="abilities.1"]').fill('Marketing ability');
  await areas.getByLabel('Analisis data',{exact:true}).uncheck();
  await expect(page.locator('textarea[name="abilities.0"]')).toHaveValue('Marketing ability');
});
