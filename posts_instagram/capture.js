const puppeteer = require('puppeteer');
const path = require('path');

const slides = [
  {
    url: 'http://localhost:8081/posts_instagram/post_1_equipe/slide_1.html',
    out: path.join(__dirname, 'post_1_equipe', 'slide_1.png'),
  },
  {
    url: 'http://localhost:8081/posts_instagram/post_1_equipe/slide_2.html',
    out: path.join(__dirname, 'post_1_equipe', 'slide_2.png'),
  },
  {
    url: 'http://localhost:8081/posts_instagram/post_1_equipe/slide_3.html',
    out: path.join(__dirname, 'post_1_equipe', 'slide_3.png'),
  },
  {
    url: 'http://localhost:8081/posts_instagram/post_2_services/slide_1.html',
    out: path.join(__dirname, 'post_2_services', 'slide_1.png'),
  },
  {
    url: 'http://localhost:8081/posts_instagram/post_2_services/slide_2.html',
    out: path.join(__dirname, 'post_2_services', 'slide_2.png'),
  },
  {
    url: 'http://localhost:8081/posts_instagram/post_2_services/slide_3.html',
    out: path.join(__dirname, 'post_2_services', 'slide_3.png'),
  },
  {
    url: 'http://localhost:8081/posts_instagram/post_3_processus/slide_1.html',
    out: path.join(__dirname, 'post_3_processus', 'slide_1.png'),
  },
  {
    url: 'http://localhost:8081/posts_instagram/post_3_processus/slide_2.html',
    out: path.join(__dirname, 'post_3_processus', 'slide_2.png'),
  },
  {
    url: 'http://localhost:8081/posts_instagram/post_3_processus/slide_3.html',
    out: path.join(__dirname, 'post_3_processus', 'slide_3.png'),
  },
  {
    url: 'http://localhost:8081/posts_instagram/post_4_temoignage/slide_1.html',
    out: path.join(__dirname, 'post_4_temoignage', 'slide_1.png'),
  },
  {
    url: 'http://localhost:8081/posts_instagram/post_4_temoignage/slide_2.html',
    out: path.join(__dirname, 'post_4_temoignage', 'slide_2.png'),
  },
  {
    url: 'http://localhost:8081/posts_instagram/post_4_temoignage/slide_3.html',
    out: path.join(__dirname, 'post_4_temoignage', 'slide_3.png'),
  },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  for (const slide of slides) {
    const page = await browser.newPage();

    // Viewport exact 1080×1350 — le JS de scale sera inutile mais sans effet
    await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
    await page.goto(slide.url, { waitUntil: 'networkidle0', timeout: 30000 });

    // S'assurer que le slide est à scale(1) et pas décalé
    await page.evaluate(() => {
      const s = document.getElementById('slide');
      if (s) {
        s.style.transform = 'scale(1)';
        s.style.marginLeft = '0';
        s.style.marginTop = '0';
      }
    });

    // Attendre les polices Google
    await page.waitForTimeout ? page.waitForTimeout(1000) : new Promise(r => setTimeout(r, 1000));

    await page.screenshot({
      path: slide.out,
      clip: { x: 0, y: 0, width: 1080, height: 1350 },
    });

    console.log('✓', slide.out);
    await page.close();
  }

  await browser.close();
  console.log('\nTerminé.');
})();
