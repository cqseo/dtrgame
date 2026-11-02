// Real browser controls against the isolated native Worker, never a live game.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';

export async function verifyOriginalBrowserOpening({mf,db,password}){
  const {chromium}=await import(process.env.DTR_PLAYWRIGHT_MODULE??'playwright-core');
  const browser=await chromium.launch({headless:true,...(process.env.DTR_CHROMIUM_PATH?{executablePath:process.env.DTR_CHROMIUM_PATH}:{}),args:['--no-sandbox']});
  const origin=new URL(await mf.ready);origin.hostname='localhost';
  const pages=new Map(),errors=[],failedResources=[];
  const url=path=>new URL(path,origin).href;
  const pass=message=>console.log('PASS browser '+message);
  try{
    for(const [i,name]of ['Alpha','Beta'].entries()){
      const context=await browser.newContext({viewport:{width:1440,height:1000},extraHTTPHeaders:{'cf-connecting-ip':'192.0.2.'+(10+i)}});
      // Keep synthetic QA traffic on its disposable local server.
      await context.route('**/*',route=>new URL(route.request().url()).origin===origin.origin?route.continue():route.abort());
      const page=await context.newPage();pages.set(name,page);page.setDefaultTimeout(45_000);
      page.on('pageerror',error=>errors.push({name,message:error.message}));
      page.on('response',response=>{if(response.status()>=400&&new URL(response.url()).origin===origin.origin)failedResources.push({name,status:response.status(),url:response.url()});});
      await page.goto(url('/login.php'),{waitUntil:'load'});
      await page.locator('input[name="username"]').fill(name);
      await page.locator('input[name="password"]').fill(password);
      await Promise.all([page.waitForURL('**/index.php'),page.locator('form[name="login"] input[type="submit"]').click()]);
      assert((await context.cookies()).some(cookie=>cookie.name==='acbra2_pass'));
    }
    pass('two separate contexts log in using the original forms, scripts and cookies');
    const alpha=pages.get('Alpha'),beta=pages.get('Beta');
    await alpha.getByRole('button',{name:'新建一个房间',exact:true}).first().click();
    await Promise.all([alpha.waitForURL('**/index.php'),alpha.locator('a.b_button').filter({hasText:/^SOLO模式$/}).click()]);
    await alpha.locator('#pos0').filter({hasText:'Alpha'}).waitFor();
    await beta.reload({waitUntil:'load'});
    await Promise.all([beta.waitForURL('**/index.php'),beta.locator('input[onclick="room_enter(1);"]').click()]);
    await beta.locator('#pos1').click();
    await beta.locator('#pos1').filter({hasText:'Beta'}).waitFor();
    await alpha.locator('#pos1').filter({hasText:'Beta'}).waitFor();
    pass('create, enter and take a seat through the original lobby controls and live updates');
    await beta.locator('#chatmsg').fill('synthetic browser lobby message');
    await beta.locator('#sendchat button').click();
    await alpha.locator('#chatdata-text').filter({hasText:'synthetic browser lobby message'}).waitFor();
    pass('the original JavaScript sends chat and updates the other browser');
    await alpha.locator('.glow_buttons.yellow[onclick*="ready"]').click();
    await beta.locator('.glow_buttons.yellow[onclick*="ready"]').click();
    for(const page of [alpha,beta]){
      await page.waitForURL('**/game.php',{timeout:120_000});
      await page.locator('form[name="gamecmd"]').waitFor({timeout:120_000});
    }
    assert.deepEqual((await db.query('select name from public.acbra2_s1_players where type=0 order by pid')).rows.map(row=>row.name),['Alpha','Beta']);
    pass('both ready buttons start the original match and both original game interfaces load');
    assert.deepEqual(errors,[],'Original browser JavaScript raised errors.');
    assert.deepEqual(failedResources,[],'Original browser resources or endpoints failed.');
    return {browser:true,completeMatch:false};
  }catch(error){
    for(const [name,page]of pages){
      console.error('BROWSER FAILURE',name,page.url());
      await writeFile('/tmp/dtr-browser-'+name+'.html',await page.content());
      await page.screenshot({path:'/tmp/dtr-browser-'+name+'.png',fullPage:true}).catch(()=>{});
    }
    console.error('BROWSER DIAGNOSTICS',JSON.stringify({errors,failedResources}));throw error;
  }finally{await browser.close();}
}
