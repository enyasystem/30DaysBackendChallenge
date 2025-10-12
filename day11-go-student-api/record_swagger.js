const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ recordVideo: { dir: '.', size: { width: 1200, height: 800 } } });
  const page = await context.newPage();
  await page.goto('http://localhost:8080/docs');
  // wait for Swagger UI to load
  await page.waitForSelector('.swagger-ui', { timeout: 15000 });
  await page.waitForTimeout(1500);

  // locate opblock for POST /students
  const op = page.locator('div.opblock:has-text("POST")').filter({ hasText: '/students' }).first();
  if (await op.count() === 0) {
    console.error('POST /students opblock not found');
    await browser.close();
    process.exit(1);
  }

  // expand opblock
  await op.locator('button.opblock-summary-control').click();
  await page.waitForTimeout(500);

  // find request body textarea inside this opblock
  const textarea = op.locator('textarea').first();
  if (await textarea.count() > 0) {
    await textarea.fill('{"first_name":"Gif","last_name":"Demo","email":"gif@example.com","enrolled":true}');
  } else {
    // sometimes swagger UI uses a codemirror instance; try input via contenteditable
    const cm = op.locator('[contenteditable]');
    if (await cm.count() > 0) {
      await cm.first().fill('{"first_name":"Gif","last_name":"Demo","email":"gif@example.com","enrolled":true}');
    }
  }

  // click Execute within this opblock
  const exec = op.locator('button.execute');
  if (await exec.count() === 0) {
    console.error('Execute button not found');
  } else {
    await exec.first().click();
  }

  // wait for response panel to show
  await page.waitForTimeout(1500);

  // close page and browser to flush video
  await page.close();
  await context.close();
  await browser.close();

  // find created video file (webm)
  const files = fs.readdirSync('.');
  const video = files.find(f => f.endsWith('.webm') || f.startsWith('video') );
  console.log('created video:', video || 'none');
})();
