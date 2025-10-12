const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const outDir = './frames';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const page = await context.newPage();
  await page.goto('http://localhost:8080/docs', { waitUntil: 'networkidle' });
  await page.waitForSelector('.swagger-ui', { timeout: 15000 });
  await page.waitForTimeout(1000);

  // take initial screenshot
  await page.screenshot({ path: `${outDir}/frame000.png` });

  // find POST /students opblock
  const op = page.locator('div.opblock:has-text("POST")').filter({ hasText: '/students' }).first();
  if (await op.count() === 0) {
    console.error('POST /students opblock not found');
    await browser.close();
    process.exit(1);
  }

  // expand opblock
  await op.locator('button.opblock-summary-control').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/frame001.png` });

  // fill request body
  const textarea = op.locator('textarea').first();
  if (await textarea.count() > 0) {
    await textarea.fill('{"first_name":"Gif","last_name":"Demo","email":"gif@example.com","enrolled":true}');
  } else {
    const cm = op.locator('[contenteditable]');
    if (await cm.count() > 0) {
      await cm.first().fill('{"first_name":"Gif","last_name":"Demo","email":"gif@example.com","enrolled":true}');
    }
  }
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/frame002.png` });

  // click Execute if available
  const exec = op.locator('button.execute').first();
  if (await exec.count() > 0) {
    await exec.click();
    await page.waitForTimeout(1000);
  }

  // capture a few frames after execution
  for (let i = 3; i < 12; i++) {
    await page.screenshot({ path: `${outDir}/frame00${i}.png` });
    await page.waitForTimeout(200);
  }

  await browser.close();
  console.log('frames saved to', outDir);
})();
