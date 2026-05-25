const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1640, height: 624, deviceScaleFactor: 1 });

  const filePath = path.join(__dirname, 'facebook_banner.html');
  const fileUrl = 'file:///' + filePath.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.evaluate(() => {
    const b = document.getElementById('banner');
    if (b) {
      b.style.transform = 'scale(1)';
      b.style.marginLeft = '0';
      b.style.marginTop = '0';
    }
  });

  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({
    path: path.join(__dirname, 'facebook_banner.png'),
    clip: { x: 0, y: 0, width: 1640, height: 624 },
  });

  await browser.close();
  console.log('✓ facebook_banner.png');
})();
